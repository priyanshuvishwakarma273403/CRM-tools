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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lead_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @Column(name = "deal_id")
    private String dealId;

    @Column(name = "ticket_id")
    private String ticketId;

    @Column(name = "thread_id")
    private String threadId;

    @Column(name = "parent_id")
    private String parentId;

    @Column(name = "template_id")
    private String templateId;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
