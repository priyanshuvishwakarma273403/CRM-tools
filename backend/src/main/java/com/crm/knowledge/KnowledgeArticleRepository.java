package com.crm.knowledge;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, String> {

    Page<KnowledgeArticle> findAllByOrganizationIdOrderByCreatedAtDesc(String organizationId, Pageable pageable);

    Page<KnowledgeArticle> findAllByOrganizationIdAndCategoryOrderByCreatedAtDesc(String organizationId, String category, Pageable pageable);

    Page<KnowledgeArticle> findAllByOrganizationIdAndStatusOrderByCreatedAtDesc(String organizationId, ArticleStatus status, Pageable pageable);

    Page<KnowledgeArticle> findAllByOrganizationIdAndCategoryAndStatusOrderByCreatedAtDesc(String organizationId, String category, ArticleStatus status, Pageable pageable);

    Optional<KnowledgeArticle> findByIdAndOrganizationId(String id, String organizationId);

    Optional<KnowledgeArticle> findByOrganizationIdAndSlug(String organizationId, String slug);

    List<KnowledgeArticle> findAllByOrganizationId(String organizationId);

    long countByOrganizationId(String organizationId);

    long countByOrganizationIdAndCategory(String organizationId, String category);

    @Query("SELECT a FROM KnowledgeArticle a WHERE a.organizationId = :orgId AND (" +
            "LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "(a.summary IS NOT NULL AND LOWER(a.summary) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
            "(a.tags IS NOT NULL AND LOWER(a.tags) LIKE LOWER(CONCAT('%', :query, '%'))))")
    List<KnowledgeArticle> searchArticles(@Param("orgId") String orgId, @Param("query") String query, Pageable pageable);
}
