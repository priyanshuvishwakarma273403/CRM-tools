package com.crm.approval;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActionApprovalRepository extends JpaRepository<ActionApproval, String> {
    Page<ActionApproval> findAllByOrganizationIdOrderByCreatedAtDesc(String organizationId, Pageable pageable);
    Page<ActionApproval> findAllByOrganizationIdAndStatusOrderByCreatedAtDesc(String organizationId, String status, Pageable pageable);
    Optional<ActionApproval> findByIdAndOrganizationId(String id, String organizationId);
    long countByOrganizationIdAndStatus(String organizationId, String status);
}
