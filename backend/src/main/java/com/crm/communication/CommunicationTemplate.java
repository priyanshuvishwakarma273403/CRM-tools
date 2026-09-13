package com.crm.communication;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "communication_templates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private String channel = "EMAIL"; // EMAIL, SMS, WHATSAPP, IN_APP

    private String subject;

    @Column(name = "body_template", columnDefinition = "TEXT", nullable = false)
    private String bodyTemplate;

    @Column(name = "variables_json", columnDefinition = "TEXT")
    private String variablesJson;

    @Builder.Default
    private String category = "GENERAL"; // SALES_PITCH, FOLLOW_UP, SUPPORT_REPLY, ONBOARDING

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
