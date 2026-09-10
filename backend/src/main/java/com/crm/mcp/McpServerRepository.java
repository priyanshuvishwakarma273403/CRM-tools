package com.crm.mcp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface McpServerRepository extends JpaRepository<McpServer, String> {
    List<McpServer> findAllByOrganizationId(String organizationId);
    Optional<McpServer> findByIdAndOrganizationId(String id, String organizationId);
    List<McpServer> findAllByOrganizationIdAndIsActiveTrue(String organizationId);
}
