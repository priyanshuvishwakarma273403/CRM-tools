package com.crm.pipeline;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deal_stage_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DealStageHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(name = "deal_id", nullable = false)
    private String dealId;

    @Column(name = "from_stage")
    private String fromStage;

    @Column(name = "to_stage", nullable = false)
    private String toStage;

    @Column(name = "from_stage_id")
    private String fromStageId;

    @Column(name = "to_stage_id")
    private String toStageId;

    @Column(name = "duration_days")
    @Builder.Default
    private Integer durationDays = 0;

    @Column(name = "actor_id")
    private String actorId;

    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
