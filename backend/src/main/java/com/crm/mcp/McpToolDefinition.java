package com.crm.mcp;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mcp_tool_definitions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McpToolDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "server_id")
    private String serverId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "input_schema_json", columnDefinition = "TEXT")
    private String inputSchemaJson;

    @Column(name = "is_destructive")
    @Builder.Default
    private Boolean isDestructive = false;

    @Column(name = "is_allowed")
    @Builder.Default
    private Boolean isAllowed = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
