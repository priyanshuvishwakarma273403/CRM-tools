package com.crm.workflow;

import com.crm.common.dto.ApiResponse;
import com.crm.security.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/workflows")
public class WorkflowController {

    private final WorkflowRuleRepository workflowRuleRepository;

    public WorkflowController(WorkflowRuleRepository workflowRuleRepository) {
        this.workflowRuleRepository = workflowRuleRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkflowRule>>> getWorkflows() {
        String tenantId = TenantContext.getCurrentTenant();
        List<WorkflowRule> workflows = workflowRuleRepository.findByOrganizationId(tenantId);
        return ResponseEntity.ok(ApiResponse.success(workflows));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkflowRule>> createWorkflow(@RequestBody WorkflowRule rule) {
        String tenantId = TenantContext.getCurrentTenant();
        rule.setOrganizationId(tenantId);
        rule.setCreatedAt(LocalDateTime.now());

        WorkflowRule saved = workflowRuleRepository.save(rule);
        return ResponseEntity.ok(ApiResponse.success(saved, "Workflow rule created successfully"));
    }
}
