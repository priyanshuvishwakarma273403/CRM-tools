package com.crm.pipeline;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "pipeline_stages")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PipelineStage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pipeline_id", nullable = false)
    @JsonBackReference
    private Pipeline pipeline;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    @Column(name = "order_index", nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;

    @Column(name = "win_probability")
    @Builder.Default
    private Integer winProbability = 10;

    @Column(name = "color_code")
    @Builder.Default
    private String colorCode = "#3B82F6";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
