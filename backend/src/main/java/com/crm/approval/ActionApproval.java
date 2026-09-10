package com.crm.approval;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "action_approvals")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(name = "requester_id")
    private String requesterId;

    @Column(name = "action_type", nullable = false)
    private String actionType; // CRM_RECORD_MERGE, BULK_DELETE, MCP_TOOL_EXECUTE, CAMPAIGN_DISPATCH

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "payload_json", columnDefinition = "TEXT")
    private String payloadJson;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, EXPIRED

    @Column(name = "reviewer_id")
    private String reviewerId;

    @Column(name = "reviewer_notes", columnDefinition = "TEXT")
    private String reviewerNotes;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (expiresAt == null) expiresAt = LocalDateTime.now().plusDays(3);
    }
}
