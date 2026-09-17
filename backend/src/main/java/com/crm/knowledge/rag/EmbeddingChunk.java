package com.crm.knowledge.rag;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "embeddings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddingChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(name = "entity_type", nullable = false)
    private String entityType; // KNOWLEDGE_ARTICLE, TICKET, CUSTOMER_NOTE, COMMUNICATION

    @Column(name = "entity_id", nullable = false)
    private String entityId;

    @Column(name = "content_chunk", columnDefinition = "TEXT", nullable = false)
    private String contentChunk;

    @Column(name = "vector_data", columnDefinition = "TEXT")
    private String vectorData; // JSON array of float embeddings

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
