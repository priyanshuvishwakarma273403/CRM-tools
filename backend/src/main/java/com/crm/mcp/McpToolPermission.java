package com.crm.mcp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mcp_tool_permissions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McpToolPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(name = "role_id")
    private String roleId;

    @Column(name = "tool_name", nullable = false)
    private String toolName;

    @Column(name = "permission_level")
    @Builder.Default
    private String permissionLevel = "EXECUTE";

    @Column(name = "require_confirmation")
    @Builder.Default
    private Boolean requireConfirmation = true;
}
