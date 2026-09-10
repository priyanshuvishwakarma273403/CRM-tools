package com.crm.mcp;

import com.crm.security.TenantContext;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Slf4j
@Service
public class McpGatewayService {

    private final CrmMcpServerService crmMcpServerService;
    private final McpServerRepository mcpServerRepository;
    private final McpToolDefinitionRepository mcpToolDefinitionRepository;
    private final McpToolPermissionRepository mcpToolPermissionRepository;
    private final McpAuditLogRepository mcpAuditLogRepository;
    private final com.crm.user.UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public McpGatewayService(CrmMcpServerService crmMcpServerService,
                             McpServerRepository mcpServerRepository,
                             McpToolDefinitionRepository mcpToolDefinitionRepository,
                             McpToolPermissionRepository mcpToolPermissionRepository,
                             McpAuditLogRepository mcpAuditLogRepository,
                             com.crm.user.UserRepository userRepository,
                             ObjectMapper objectMapper) {
        this.crmMcpServerService = crmMcpServerService;
        this.mcpServerRepository = mcpServerRepository;
        this.mcpToolDefinitionRepository = mcpToolDefinitionRepository;
        this.mcpToolPermissionRepository = mcpToolPermissionRepository;
        this.mcpAuditLogRepository = mcpAuditLogRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
    }

    /**
     * Discovers all available tools for current tenant (Built-in CRM Tools + Active External Servers)
     */
    public List<McpToolDto> listAvailableTools() {
        String orgId = TenantContext.getCurrentTenant();
        List<McpToolDto> tools = new ArrayList<>(crmMcpServerService.getBuiltinTools());

        if (orgId != null) {
            List<McpServer> activeServers = mcpServerRepository.findAllByOrganizationIdAndIsActiveTrue(orgId);
            for (McpServer server : activeServers) {
                List<McpToolDefinition> defs = mcpToolDefinitionRepository.findAllByServerId(server.getId());
                for (McpToolDefinition def : defs) {
                    if (Boolean.TRUE.equals(def.getIsAllowed())) {
                        Map<String, Object> schema = parseJsonMap(def.getInputSchemaJson());
                        tools.add(McpToolDto.builder()
                                .name(def.getName())
                                .description(def.getDescription())
                                .inputSchema(schema)
                                .destructive(Boolean.TRUE.equals(def.getIsDestructive()))
                                .requireConfirmation(Boolean.TRUE.equals(def.getIsDestructive()))
                                .source(server.getName())
                                .build());
                    }
                }
            }

            // Overlay custom tenant permission requirements
            for (McpToolDto tool : tools) {
                mcpToolPermissionRepository.findByOrganizationIdAndToolName(orgId, tool.getName())
                        .ifPresent(perm -> {
                            if (perm.getRequireConfirmation() != null) {
                                tool.setRequireConfirmation(perm.getRequireConfirmation());
                            }
                        });
            }
        }

        return tools;
    }

    /**
     * Executes an MCP Tool call through the secure gateway with policy checks and audit logging.
     */
    public McpExecuteResponse executeTool(McpExecuteRequest request) {
        long startTime = System.currentTimeMillis();
        String orgId = TenantContext.getCurrentTenant();
        String userId = getCurrentUserId();
        String toolName = request.getTool();
        Map<String, Object> params = request.getParameters() != null ? request.getParameters() : Collections.emptyMap();

        if (toolName == null || toolName.isBlank()) {
            return McpExecuteResponse.builder()
                    .tool("unknown")
                    .status("ERROR")
                    .message("Tool name is required")
                    .build();
        }

        // 1. Permission check
        if (orgId != null) {
            Optional<McpToolPermission> permOpt = mcpToolPermissionRepository.findByOrganizationIdAndToolName(orgId, toolName);
            if (permOpt.isPresent()) {
                McpToolPermission perm = permOpt.get();
                if ("DENIED".equalsIgnoreCase(perm.getPermissionLevel()) || "NONE".equalsIgnoreCase(perm.getPermissionLevel())) {
                    logAudit(orgId, userId, toolName, params, "PERMISSION_DENIED", "Access denied by tenant policy", System.currentTimeMillis() - startTime);
                    return McpExecuteResponse.builder()
                            .tool(toolName)
                            .status("PERMISSION_DENIED")
                            .message("Permission denied to execute tool: " + toolName)
                            .build();
                }

                // 2. Destructive confirmation check
                if (Boolean.TRUE.equals(perm.getRequireConfirmation()) && !Boolean.TRUE.equals(request.getConfirmed())) {
                    logAudit(orgId, userId, toolName, params, "CONFIRMATION_REQUIRED", "Awaiting explicit user confirmation", System.currentTimeMillis() - startTime);
                    return McpExecuteResponse.builder()
                            .tool(toolName)
                            .status("CONFIRMATION_REQUIRED")
                            .requiresConfirmation(true)
                            .confirmationPrompt("Action '" + toolName + "' modifies system data. Please confirm execution to proceed.")
                            .build();
                }
            }
        }

        // 3. Dispatch execution
        try {
            Object result;
            if (toolName.startsWith("crm.")) {
                result = crmMcpServerService.executeBuiltinTool(toolName, params);
            } else {
                result = executeExternalTool(orgId, toolName, params);
            }

            long elapsed = System.currentTimeMillis() - startTime;
            logAudit(orgId, userId, toolName, params, "SUCCESS", result, elapsed);

            return McpExecuteResponse.builder()
                    .tool(toolName)
                    .status("SUCCESS")
                    .result(result)
                    .executionTimeMs(elapsed)
                    .build();

        } catch (Exception ex) {
            long elapsed = System.currentTimeMillis() - startTime;
            log.error("Failed to execute MCP tool: {}", toolName, ex);
            logAudit(orgId, userId, toolName, params, "ERROR", ex.getMessage(), elapsed);

            return McpExecuteResponse.builder()
                    .tool(toolName)
                    .status("ERROR")
                    .message(ex.getMessage())
                    .executionTimeMs(elapsed)
                    .build();
        }
    }

    private Object executeExternalTool(String orgId, String toolName, Map<String, Object> params) throws Exception {
        McpToolDefinition def = mcpToolDefinitionRepository.findByName(toolName)
                .orElseThrow(() -> new IllegalArgumentException("Unknown external tool: " + toolName));

        if (!Boolean.TRUE.equals(def.getIsAllowed())) {
            throw new SecurityException("Tool " + toolName + " is disabled by administrator");
        }

        McpServer server = mcpServerRepository.findById(def.getServerId())
                .orElseThrow(() -> new IllegalStateException("MCP Server not configured for tool: " + toolName));

        if (!Boolean.TRUE.equals(server.getIsActive())) {
            throw new IllegalStateException("MCP Server " + server.getName() + " is currently inactive");
        }

        // Dispatch call to external MCP Server HTTP endpoint
        String payload = objectMapper.writeValueAsString(Map.of(
                "jsonrpc", "2.0",
                "method", "tools/call",
                "params", Map.of(
                        "name", toolName,
                        "arguments", params
                ),
                "id", UUID.randomUUID().toString()
        ));

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(server.getServerUrl() + "/tools/call"))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(5))
                .POST(HttpRequest.BodyPublishers.ofString(payload));

        if (server.getAuthTokenEnc() != null && !server.getAuthTokenEnc().isBlank()) {
            builder.header("Authorization", "Bearer " + server.getAuthTokenEnc());
        }

        HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});
        } else {
            throw new RuntimeException("External MCP server error: HTTP " + response.statusCode() + " -> " + response.body());
        }
    }

    @Transactional
    public McpServer registerExternalServer(McpServerRegistrationRequest req) {
        String orgId = TenantContext.getCurrentTenant();
        McpServer server = McpServer.builder()
                .organizationId(orgId)
                .name(req.getName())
                .serverUrl(req.getServerUrl())
                .transportType(req.getTransportType() != null ? req.getTransportType() : "HTTP_SSE")
                .authTokenEnc(req.getAuthToken())
                .isActive(true)
                .status("CONNECTED")
                .build();
        return mcpServerRepository.save(server);
    }

    public List<McpServer> getRegisteredServers() {
        String orgId = TenantContext.getCurrentTenant();
        return mcpServerRepository.findAllByOrganizationId(orgId);
    }

    @Transactional
    public void deleteServer(String id) {
        String orgId = TenantContext.getCurrentTenant();
        mcpServerRepository.findByIdAndOrganizationId(id, orgId).ifPresent(mcpServerRepository::delete);
    }

    public Page<McpAuditLog> getAuditLogs(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return mcpAuditLogRepository.findAllByOrganizationIdOrderByCreatedAtDesc(orgId, pageable);
    }

    public List<McpToolPermission> getPermissions() {
        String orgId = TenantContext.getCurrentTenant();
        return mcpToolPermissionRepository.findAllByOrganizationId(orgId);
    }

    @Transactional
    public McpToolPermission configurePermission(McpToolPermission permission) {
        String orgId = TenantContext.getCurrentTenant();
        permission.setOrganizationId(orgId);

        Optional<McpToolPermission> existing = mcpToolPermissionRepository
                .findByOrganizationIdAndToolName(orgId, permission.getToolName());
        if (existing.isPresent()) {
            McpToolPermission current = existing.get();
            current.setPermissionLevel(permission.getPermissionLevel());
            current.setRequireConfirmation(permission.getRequireConfirmation());
            return mcpToolPermissionRepository.save(current);
        }
        return mcpToolPermissionRepository.save(permission);
    }

    private void logAudit(String orgId, String userId, String toolName, Object input, String status, Object output, long elapsed) {
        try {
            String inputStr = objectMapper.writeValueAsString(input);
            String outputStr = output instanceof String ? (String) output : objectMapper.writeValueAsString(output);

            String validUserId = null;
            if (userId != null && userRepository.existsById(userId)) {
                validUserId = userId;
            }

            McpAuditLog logEntry = McpAuditLog.builder()
                    .organizationId(orgId != null ? orgId : "SYSTEM")
                    .userId(validUserId)
                    .toolName(toolName)
                    .inputJson(inputStr)
                    .outputJson(outputStr)
                    .status(status)
                    .executionTimeMs(elapsed)
                    .build();

            mcpAuditLogRepository.save(logEntry);
        } catch (Exception ex) {
            log.warn("Failed to persist MCP audit log: {}", ex.getMessage());
        }
    }

    private Map<String, Object> parseJsonMap(String json) {
        if (json == null || json.isBlank()) return Collections.emptyMap();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "system";
    }
}
