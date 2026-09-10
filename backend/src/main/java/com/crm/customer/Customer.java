package com.crm.customer;

import com.crm.company.Company;
import com.crm.contact.Contact;
import com.crm.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String name;

    @Column(name = "customer_type")
    @Builder.Default
    private String customerType = "ORGANIZATION";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_contact_id")
    private Contact primaryContact;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    private String industry;

    @Builder.Default
    private String tier = "STANDARD";

    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "health_score")
    @Builder.Default
    private Integer healthScore = 85;

    @Column(name = "lifetime_value")
    @Builder.Default
    private BigDecimal lifetimeValue = BigDecimal.ZERO;

    @Column(name = "annual_recurring_revenue")
    @Builder.Default
    private BigDecimal annualRecurringRevenue = BigDecimal.ZERO;

    @Column(name = "churn_probability")
    @Builder.Default
    private BigDecimal churnProbability = BigDecimal.ZERO;

    @Column(name = "last_contacted_at")
    private LocalDateTime lastContactedAt;

    private String tags;

    @Column(name = "custom_attributes_json", columnDefinition = "TEXT")
    private String customAttributesJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
