package com.crm.mcp;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mcp")
public class McpController {

    private final McpGatewayService mcpGatewayService;

    public McpController(McpGatewayService mcpGatewayService) {
        this.mcpGatewayService = mcpGatewayService;
    }

    /**
     * Lists all registered MCP tools (Built-in CRM Tools + Active External Tools)
     */
    @GetMapping("/tools")
    public ResponseEntity<ApiResponse<List<McpToolDto>>> listTools() {
        List<McpToolDto> tools = mcpGatewayService.listAvailableTools();
        return ResponseEntity.ok(ApiResponse.success(tools, "MCP tools discovered successfully"));
    }

    /**
     * Executes an MCP tool call through the secure gateway with policy checks and immutable audit logging.
     */
    @PostMapping("/execute")
    public ResponseEntity<ApiResponse<McpExecuteResponse>> executeTool(@RequestBody McpExecuteRequest request) {
        McpExecuteResponse response = mcpGatewayService.executeTool(request);
        return ResponseEntity.ok(ApiResponse.success(response, "MCP tool executed with status: " + response.getStatus()));
    }

    /**
     * External MCP Servers Management
     */
    @GetMapping("/servers")
    public ResponseEntity<ApiResponse<List<McpServer>>> getServers() {
        return ResponseEntity.ok(ApiResponse.success(mcpGatewayService.getRegisteredServers(), "MCP servers retrieved"));
    }

    @PostMapping("/servers")
    public ResponseEntity<ApiResponse<McpServer>> registerServer(@RequestBody McpServerRegistrationRequest request) {
        McpServer server = mcpGatewayService.registerExternalServer(request);
        return ResponseEntity.ok(ApiResponse.success(server, "External MCP server registered successfully"));
    }

    @DeleteMapping("/servers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteServer(@PathVariable String id) {
        mcpGatewayService.deleteServer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "External MCP server removed"));
    }

    /**
     * Governance & Permissions
     */
    @GetMapping("/permissions")
    public ResponseEntity<ApiResponse<List<McpToolPermission>>> getPermissions() {
        return ResponseEntity.ok(ApiResponse.success(mcpGatewayService.getPermissions(), "Tool permissions retrieved"));
    }

    @PostMapping("/permissions")
    public ResponseEntity<ApiResponse<McpToolPermission>> configurePermission(@RequestBody McpToolPermission permission) {
        return ResponseEntity.ok(ApiResponse.success(mcpGatewayService.configurePermission(permission), "Tool permission saved"));
    }

    /**
     * Immutable MCP Audit Trail
     */
    @GetMapping("/audit")
    public ResponseEntity<ApiResponse<PageResponse<McpAuditLog>>> getAuditLogs(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(mcpGatewayService.getAuditLogs(pageable)), "Audit logs retrieved"));
    }
}
