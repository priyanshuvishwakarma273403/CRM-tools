package com.crm.mcp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface McpToolPermissionRepository extends JpaRepository<McpToolPermission, String> {
    List<McpToolPermission> findAllByOrganizationId(String organizationId);
    Optional<McpToolPermission> findByOrganizationIdAndToolName(String organizationId, String toolName);
    Optional<McpToolPermission> findByOrganizationIdAndRoleIdAndToolName(String organizationId, String roleId, String toolName);
}
