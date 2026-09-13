package com.crm.support;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SlaPolicyRepository extends JpaRepository<SlaPolicy, String> {
    List<SlaPolicy> findByOrganizationIdAndIsActiveTrue(String organizationId);
    Optional<SlaPolicy> findByOrganizationIdAndPriorityAndIsActiveTrue(String organizationId, String priority);
}
