package com.crm.mcp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface McpAuditLogRepository extends JpaRepository<McpAuditLog, String> {
    Page<McpAuditLog> findAllByOrganizationIdOrderByCreatedAtDesc(String organizationId, Pageable pageable);
    List<McpAuditLog> findTop50ByOrganizationIdOrderByCreatedAtDesc(String organizationId);
    Page<McpAuditLog> findAllByOrganizationIdAndToolNameOrderByCreatedAtDesc(String organizationId, String toolName, Pageable pageable);
}
