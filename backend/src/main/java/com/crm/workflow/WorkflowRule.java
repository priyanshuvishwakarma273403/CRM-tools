package com.crm.workflow;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_rules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "trigger_type", nullable = false)
    private String triggerType;

    @Column(name = "condition_json", columnDefinition = "TEXT")
    private String conditionJson;

    @Column(name = "action_type", nullable = false)
    private String actionType;

    @Column(name = "action_config_json", columnDefinition = "TEXT")
    private String actionConfigJson;

    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
