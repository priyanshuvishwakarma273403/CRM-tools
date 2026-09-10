package com.crm.communication;

import com.crm.customer.Customer;
import com.crm.lead.Lead;
import com.crm.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "communication_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String channel; // EMAIL, CALL, SMS, WHATSAPP, MEETING, IN_APP

    @Column(nullable = false)
    @Builder.Default
    private String direction = "OUTBOUND"; // INBOUND, OUTBOUND

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String sender;
    private String recipient;

    @Builder.Default
    private String status = "SENT";

    private String sentiment; // POSITIVE, NEUTRAL, NEGATIVE

    @Column(name = "recording_url")
    private String recordingUrl;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
