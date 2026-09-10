package com.crm.company;

import com.crm.organization.Organization;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    @JsonIgnore
    private Organization organization;

    @Column(nullable = false)
    private String name;

    private String industry;

    private String website;

    private Integer employees;

    @Column(name = "annual_revenue")
    private BigDecimal annualRevenue;

    private String phone;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String city;

    private String country;

    @Column(name = "owner_id")
    private String ownerId;

    private String tags;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
