package com.crm.mcp;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mcp_servers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McpServer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String name;

    @Column(name = "server_url", nullable = false)
    private String serverUrl;

    @Column(name = "transport_type")
    @Builder.Default
    private String transportType = "HTTP_SSE";

    @Column(name = "auth_token_enc", columnDefinition = "TEXT")
    private String authTokenEnc;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private String status = "CONNECTED";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
