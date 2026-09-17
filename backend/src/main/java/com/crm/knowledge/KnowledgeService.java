package com.crm.knowledge;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.event.CrmDomainEvent;
import com.crm.event.DomainEventPublisher;
import com.crm.knowledge.dto.*;
import com.crm.knowledge.rag.EmbeddingChunk;
import com.crm.knowledge.rag.EmbeddingChunkRepository;
import com.crm.knowledge.rag.RagRetrievalService;
import com.crm.knowledge.rag.VectorEmbeddingService;
import com.crm.security.TenantContext;
import com.crm.user.User;
import com.crm.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeService {

    private final KnowledgeArticleRepository knowledgeArticleRepository;
    private final EmbeddingChunkRepository embeddingChunkRepository;
    private final VectorEmbeddingService vectorEmbeddingService;
    private final RagRetrievalService ragRetrievalService;
    private final UserRepository userRepository;
    private final DomainEventPublisher domainEventPublisher;

    public Page<KnowledgeArticle> getArticles(String category, ArticleStatus status, Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        if (category != null && !category.isBlank() && status != null) {
            return knowledgeArticleRepository.findAllByOrganizationIdAndCategoryAndStatusOrderByCreatedAtDesc(orgId, category, status, pageable);
        } else if (category != null && !category.isBlank()) {
            return knowledgeArticleRepository.findAllByOrganizationIdAndCategoryOrderByCreatedAtDesc(orgId, category, pageable);
        } else if (status != null) {
            return knowledgeArticleRepository.findAllByOrganizationIdAndStatusOrderByCreatedAtDesc(orgId, status, pageable);
        }
        return knowledgeArticleRepository.findAllByOrganizationIdOrderByCreatedAtDesc(orgId, pageable);
    }

    @Transactional
    public KnowledgeArticle getArticleById(String id, boolean incrementView) {
        String orgId = TenantContext.getCurrentTenant();
        KnowledgeArticle article = knowledgeArticleRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge article not found with id: " + id));
        if (incrementView) {
            article.setViewCount((article.getViewCount() == null ? 0 : article.getViewCount()) + 1);
            return knowledgeArticleRepository.save(article);
        }
        return article;
    }

    @Transactional
    public KnowledgeArticle getArticleBySlug(String slug, boolean incrementView) {
        String orgId = TenantContext.getCurrentTenant();
        KnowledgeArticle article = knowledgeArticleRepository.findByOrganizationIdAndSlug(orgId, slug)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge article not found with slug: " + slug));
        if (incrementView) {
            article.setViewCount((article.getViewCount() == null ? 0 : article.getViewCount()) + 1);
            return knowledgeArticleRepository.save(article);
        }
        return article;
    }

    @Transactional
    public KnowledgeArticle createArticle(CreateArticleRequest request, String authorId) {
        String orgId = TenantContext.getCurrentTenant();

        String slug = generateSlug(request.getTitle(), orgId);

        String summary = request.getSummary();
        if ((summary == null || summary.isBlank()) && request.getContent() != null) {
            String content = request.getContent().trim();
            summary = content.length() > 180 ? content.substring(0, 180) + "..." : content;
        }

        User author = null;
        if (authorId != null) {
            author = userRepository.findById(authorId).orElse(null);
        }

        KnowledgeArticle article = KnowledgeArticle.builder()
                .organizationId(orgId)
                .title(request.getTitle().trim())
                .slug(slug)
                .summary(summary)
                .content(request.getContent())
                .category(request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory().toUpperCase() : "GENERAL")
                .status(request.getStatus() != null ? request.getStatus() : ArticleStatus.PUBLISHED)
                .tags(request.getTags())
                .author(author)
                .viewCount(0)
                .build();

        KnowledgeArticle saved = knowledgeArticleRepository.save(article);

        // Synchronize RAG vector embeddings
        syncEmbeddings(saved);

        Map<String, Object> payload = new HashMap<>();
        payload.put("articleId", saved.getId());
        payload.put("title", saved.getTitle());
        payload.put("slug", saved.getSlug());
        payload.put("category", saved.getCategory());
        payload.put("status", saved.getStatus().name());

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("KNOWLEDGE_ARTICLE_CREATED")
                .entityType("KNOWLEDGE_ARTICLE")
                .entityId(saved.getId())
                .actorId(authorId != null ? authorId : "system")
                .payload(payload)
                .build());

        return saved;
    }

    @Transactional
    public KnowledgeArticle updateArticle(String id, UpdateArticleRequest request) {
        String orgId = TenantContext.getCurrentTenant();
        KnowledgeArticle existing = getArticleById(id, false);

        boolean contentChanged = false;

        if (request.getTitle() != null && !request.getTitle().isBlank() && !request.getTitle().equals(existing.getTitle())) {
            existing.setTitle(request.getTitle().trim());
            existing.setSlug(generateSlug(request.getTitle(), orgId));
            contentChanged = true;
        }

        if (request.getContent() != null && !request.getContent().equals(existing.getContent())) {
            existing.setContent(request.getContent());
            contentChanged = true;
        }

        if (request.getSummary() != null) {
            existing.setSummary(request.getSummary());
        }

        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            existing.setCategory(request.getCategory().toUpperCase());
        }

        if (request.getTags() != null) {
            existing.setTags(request.getTags());
        }

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        KnowledgeArticle saved = knowledgeArticleRepository.save(existing);

        if (contentChanged) {
            syncEmbeddings(saved);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("articleId", saved.getId());
        payload.put("title", saved.getTitle());
        payload.put("slug", saved.getSlug());
        payload.put("category", saved.getCategory());

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("KNOWLEDGE_ARTICLE_UPDATED")
                .entityType("KNOWLEDGE_ARTICLE")
                .entityId(saved.getId())
                .payload(payload)
                .build());

        return saved;
    }

    @Transactional
    public KnowledgeArticle updateArticleStatus(String id, ArticleStatus status) {
        KnowledgeArticle existing = getArticleById(id, false);
        existing.setStatus(status);
        return knowledgeArticleRepository.save(existing);
    }

    @Transactional
    public void deleteArticle(String id) {
        String orgId = TenantContext.getCurrentTenant();
        KnowledgeArticle existing = getArticleById(id, false);

        embeddingChunkRepository.deleteByOrganizationIdAndEntityIdAndEntityType(
                orgId, id, "KNOWLEDGE_ARTICLE"
        );
        knowledgeArticleRepository.delete(existing);

        Map<String, Object> payload = new HashMap<>();
        payload.put("articleId", id);
        payload.put("title", existing.getTitle());

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("KNOWLEDGE_ARTICLE_DELETED")
                .entityType("KNOWLEDGE_ARTICLE")
                .entityId(id)
                .payload(payload)
                .build());
    }

    public List<CategoryCountResponse> getCategoriesWithCounts() {
        String orgId = TenantContext.getCurrentTenant();
        List<KnowledgeArticle> articles = knowledgeArticleRepository.findAllByOrganizationId(orgId);

        Map<String, Long> counts = articles.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCategory() != null ? a.getCategory() : "GENERAL",
                        Collectors.counting()
                ));

        return counts.entrySet().stream()
                .map(e -> CategoryCountResponse.builder()
                        .category(e.getKey())
                        .count(e.getValue())
                        .build())
                .sorted(Comparator.comparing(CategoryCountResponse::getCategory))
                .collect(Collectors.toList());
    }

    public List<RagSourceItem> searchArticles(RagSearchRequest request) {
        String orgId = TenantContext.getCurrentTenant();
        int limit = request.getLimit() != null ? request.getLimit() : 5;
        return ragRetrievalService.hybridSearch(orgId, request.getQuery(), request.getCategory(), limit);
    }

    public RagAskResponse askQuestion(RagAskRequest request) {
        String orgId = TenantContext.getCurrentTenant();
        return ragRetrievalService.answerQuestion(orgId, request.getQuestion(), request.getCategory());
    }

    private void syncEmbeddings(KnowledgeArticle article) {
        embeddingChunkRepository.deleteByOrganizationIdAndEntityIdAndEntityType(
                article.getOrganizationId(), article.getId(), "KNOWLEDGE_ARTICLE"
        );

        List<String> chunks = vectorEmbeddingService.chunkText(article.getContent(), 400);
        if (chunks.isEmpty() && article.getTitle() != null) {
            chunks = List.of(article.getTitle() + "\n" + (article.getSummary() != null ? article.getSummary() : ""));
        }

        for (String chunk : chunks) {
            String vectorJson = vectorEmbeddingService.computeEmbeddingJson(chunk);
            EmbeddingChunk embeddingChunk = EmbeddingChunk.builder()
                    .organizationId(article.getOrganizationId())
                    .entityType("KNOWLEDGE_ARTICLE")
                    .entityId(article.getId())
                    .contentChunk(chunk)
                    .vectorData(vectorJson)
                    .build();
            embeddingChunkRepository.save(embeddingChunk);
        }
    }

    private String generateSlug(String title, String orgId) {
        if (title == null || title.isBlank()) {
            return "article-" + System.currentTimeMillis();
        }
        String baseSlug = title.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        if (baseSlug.isEmpty()) {
            baseSlug = "article";
        }
        String candidateSlug = baseSlug;
        int counter = 1;
        while (knowledgeArticleRepository.findByOrganizationIdAndSlug(orgId, candidateSlug).isPresent()) {
            candidateSlug = baseSlug + "-" + counter++;
        }
        return candidateSlug;
    }
}
