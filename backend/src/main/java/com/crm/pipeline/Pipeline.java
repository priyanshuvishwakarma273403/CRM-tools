package com.crm.pipeline;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pipelines")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pipeline {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;

    @OneToMany(mappedBy = "pipeline", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    @JsonManagedReference
    @Builder.Default
    private List<PipelineStage> stages = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
