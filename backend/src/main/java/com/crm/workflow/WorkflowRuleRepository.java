package com.crm.workflow;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkflowRuleRepository extends JpaRepository<WorkflowRule, String> {
    List<WorkflowRule> findByOrganizationId(String organizationId);
}
