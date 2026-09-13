package com.crm.lead;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_conversions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadConversion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(name = "lead_id", nullable = false)
    private String leadId;

    @Column(name = "company_id")
    private String companyId;

    @Column(name = "contact_id")
    private String contactId;

    @Column(name = "deal_id")
    private String dealId;

    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "converted_by_user_id")
    private String convertedByUserId;

    @Column(name = "converted_at", updatable = false)
    private LocalDateTime convertedAt;

    @PrePersist
    protected void onCreate() {
        if (convertedAt == null) {
            convertedAt = LocalDateTime.now();
        }
    }
}
