package com.crm.mcp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface McpToolDefinitionRepository extends JpaRepository<McpToolDefinition, String> {
    Optional<McpToolDefinition> findByName(String name);
    List<McpToolDefinition> findAllByServerId(String serverId);
    List<McpToolDefinition> findAllByIsAllowedTrue();
}
