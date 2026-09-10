package com.crm.developer;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "webhooks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Webhook {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String secret;

    @Column(name = "subscribed_events_json", columnDefinition = "TEXT")
    private String subscribedEventsJson; // e.g. ["lead.created", "deal.won", "task.completed"]

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
