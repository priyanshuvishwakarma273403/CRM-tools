package com.crm.deal;

import com.crm.company.Company;
import com.crm.contact.Contact;
import com.crm.organization.Organization;
import com.crm.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    @JsonIgnore
    private Organization organization;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Column(name = "customer_id")
    private String customerId;

    @Column(nullable = false)
    private String title;

    @Column(name = "\"value\"")
    @Builder.Default
    private BigDecimal value = BigDecimal.ZERO;

    @Builder.Default
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DealStage stage = DealStage.NEW;

    @Column(name = "pipeline_id")
    private String pipelineId;

    @Column(name = "stage_id")
    private String stageId;

    @Builder.Default
    private Integer probability = 10;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    private String tags;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "loss_reason")
    private String lossReason;

    @Column(name = "win_reason")
    private String winReason;

    @Column(name = "stage_entered_at")
    @Builder.Default
    private LocalDateTime stageEnteredAt = LocalDateTime.now();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
