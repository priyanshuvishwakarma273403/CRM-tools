package com.crm.knowledge;

import com.crm.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "knowledge_articles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    private String category = "GENERAL";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ArticleStatus status = ArticleStatus.PUBLISHED;

    private String tags;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
