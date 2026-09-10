package com.crm.developer;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "webhook_deliveries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "webhook_id", nullable = false)
    private String webhookId;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "payload_json", columnDefinition = "TEXT")
    private String payloadJson;

    @Column(name = "status_code")
    private Integer statusCode;

    @Builder.Default
    private Integer attempts = 1;

    @Builder.Default
    private String status = "SUCCESS"; // SUCCESS, FAILED, PENDING

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @PrePersist
    protected void onCreate() {
        if (deliveredAt == null) deliveredAt = LocalDateTime.now();
    }
}
