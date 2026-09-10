package com.crm.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    Page<AuditLog> findByOrganizationId(String organizationId, Pageable pageable);
}
