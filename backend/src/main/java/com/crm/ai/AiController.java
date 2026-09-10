package com.crm.ai;

import com.crm.common.dto.ApiResponse;
import com.crm.security.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiServiceClient aiServiceClient;

    public AiController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    @PostMapping("/lead-score")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scoreLead(@RequestBody Map<String, Object> payload) {
        Map<String, Object> result = aiServiceClient.scoreLead(payload);
        return ResponseEntity.ok(ApiResponse.success(result, "Lead score calculated"));
    }

    @PostMapping("/deal-risk")
    public ResponseEntity<ApiResponse<Map<String, Object>>> assessDealRisk(@RequestBody Map<String, Object> payload) {
        Map<String, Object> result = aiServiceClient.assessDealRisk(payload);
        return ResponseEntity.ok(ApiResponse.success(result, "Deal risk evaluated"));
    }

    @PostMapping("/copilot")
    public ResponseEntity<ApiResponse<Map<String, Object>>> queryCopilot(@RequestBody Map<String, Object> payload) {
        String query = (String) payload.getOrDefault("query", "");
        String orgId = TenantContext.getCurrentTenant();
        Map<String, Object> result = aiServiceClient.queryCopilot(query, orgId, "SALES_AGENT");
        return ResponseEntity.ok(ApiResponse.success(result, "Copilot response generated"));
    }

    @PostMapping("/email-draft")
    public ResponseEntity<ApiResponse<Map<String, Object>>> draftEmail(@RequestBody Map<String, Object> payload) {
        Map<String, Object> result = aiServiceClient.draftEmail(payload);
        return ResponseEntity.ok(ApiResponse.success(result, "Email draft generated"));
    }

    /**
     * Multi-Agent AI System: dispatches task to specialized agents (Sales, Support, Marketing, Finance, Research)
     */
    @PostMapping("/agent/execute")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeAgent(@RequestBody Map<String, Object> payload) {
        String orgId = TenantContext.getCurrentTenant();
        String userId = getCurrentUserId();

        Map<String, Object> req = new HashMap<>(payload);
        req.put("organization_id", orgId);
        req.put("user_id", userId);

        Map<String, Object> result = aiServiceClient.executeAgentTask(req);
        return ResponseEntity.ok(ApiResponse.success(result, "Agent task executed successfully"));
    }

    @PostMapping("/agent/{agentType}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeSpecificAgent(
            @PathVariable String agentType,
            @RequestBody Map<String, Object> payload) {
        String orgId = TenantContext.getCurrentTenant();
        String userId = getCurrentUserId();

        Map<String, Object> req = new HashMap<>(payload);
        req.put("agent_type", agentType.toUpperCase());
        req.put("organization_id", orgId);
        req.put("user_id", userId);

        Map<String, Object> result = aiServiceClient.executeAgentTask(req);
        return ResponseEntity.ok(ApiResponse.success(result, agentType.toUpperCase() + " agent executed"));
    }

    /**
     * Ask My CRM: Safe natural language to SQL analytics
     */
    @PostMapping("/ask-crm")
    public ResponseEntity<ApiResponse<Map<String, Object>>> askCrm(@RequestBody Map<String, Object> payload) {
        String query = (String) payload.getOrDefault("query", "");
        String orgId = TenantContext.getCurrentTenant();
        String role = "MANAGER";

        Map<String, Object> result = aiServiceClient.askCrm(query, orgId, role);
        return ResponseEntity.ok(ApiResponse.success(result, "Ask My CRM analysis generated"));
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "system";
    }
}
