package com.crm.workflow;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.common.exception.ResourceNotFoundException;
import com.crm.event.CrmDomainEvent;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/workflows")
public class WorkflowController {

    private final WorkflowRuleRepository workflowRuleRepository;
    private final WorkflowExecutionRepository workflowExecutionRepository;
    private final WorkflowEngineService workflowEngineService;

    public WorkflowController(WorkflowRuleRepository workflowRuleRepository,
                              WorkflowExecutionRepository workflowExecutionRepository,
                              WorkflowEngineService workflowEngineService) {
        this.workflowRuleRepository = workflowRuleRepository;
        this.workflowExecutionRepository = workflowExecutionRepository;
        this.workflowEngineService = workflowEngineService;
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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkflowRule>> updateWorkflow(@PathVariable String id, @RequestBody WorkflowRule updated) {
        String tenantId = TenantContext.getCurrentTenant();
        WorkflowRule existing = workflowRuleRepository.findById(id)
                .filter(r -> r.getOrganizationId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Workflow rule not found: " + id));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setTriggerType(updated.getTriggerType());
        existing.setConditionJson(updated.getConditionJson());
        existing.setActionType(updated.getActionType());
        existing.setActionConfigJson(updated.getActionConfigJson());
        if (updated.getIsActive() != null) {
            existing.setIsActive(updated.getIsActive());
        }

        WorkflowRule saved = workflowRuleRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success(saved, "Workflow rule updated successfully"));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<WorkflowRule>> toggleWorkflow(@PathVariable String id) {
        String tenantId = TenantContext.getCurrentTenant();
        WorkflowRule existing = workflowRuleRepository.findById(id)
                .filter(r -> r.getOrganizationId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Workflow rule not found: " + id));

        existing.setIsActive(!Boolean.TRUE.equals(existing.getIsActive()));
        WorkflowRule saved = workflowRuleRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success(saved, "Workflow rule active state updated to: " + saved.getIsActive()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkflow(@PathVariable String id) {
        String tenantId = TenantContext.getCurrentTenant();
        WorkflowRule existing = workflowRuleRepository.findById(id)
                .filter(r -> r.getOrganizationId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Workflow rule not found: " + id));

        workflowRuleRepository.delete(existing);
        return ResponseEntity.ok(ApiResponse.success(null, "Workflow rule deleted"));
    }

    @GetMapping("/executions")
    public ResponseEntity<ApiResponse<PageResponse<WorkflowExecution>>> getExecutions(Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        Page<WorkflowExecution> page = workflowExecutionRepository.findByOrganizationIdOrderByExecutedAtDesc(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<ApiResponse<WorkflowExecution>> executeWorkflowManually(@PathVariable String id,
                                                                                  @RequestBody(required = false) Map<String, Object> payload) {
        String tenantId = TenantContext.getCurrentTenant();
        WorkflowRule rule = workflowRuleRepository.findById(id)
                .filter(r -> r.getOrganizationId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Workflow rule not found: " + id));

        CrmDomainEvent testEvent = CrmDomainEvent.builder()
                .organizationId(tenantId)
                .eventType(rule.getTriggerType())
                .entityType("MANUAL_TEST")
                .entityId(rule.getId())
                .payload(payload != null ? payload : Map.of("test", true))
                .build();

        WorkflowExecution execution = workflowEngineService.executeRule(rule, testEvent);
        return ResponseEntity.ok(ApiResponse.success(execution, "Workflow execution finished with status: " + execution.getStatus()));
    }
}
