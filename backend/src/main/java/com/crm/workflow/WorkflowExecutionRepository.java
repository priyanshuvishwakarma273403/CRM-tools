package com.crm.workflow;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkflowExecutionRepository extends JpaRepository<WorkflowExecution, String> {
    Page<WorkflowExecution> findByOrganizationIdOrderByExecutedAtDesc(String organizationId, Pageable pageable);
    List<WorkflowExecution> findByWorkflowIdOrderByExecutedAtDesc(String workflowId);
    List<WorkflowExecution> findByOrganizationIdAndEntityId(String organizationId, String entityId);
}
