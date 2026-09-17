package com.crm.knowledge;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.knowledge.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/knowledge")
@RequiredArgsConstructor
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @GetMapping("/articles")
    public ResponseEntity<ApiResponse<PageResponse<KnowledgeArticle>>> getArticles(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ArticleStatus status,
            Pageable pageable) {
        Page<KnowledgeArticle> page = knowledgeService.getArticles(category, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<ApiResponse<KnowledgeArticle>> getArticleById(@PathVariable String id) {
        KnowledgeArticle article = knowledgeService.getArticleById(id, true);
        return ResponseEntity.ok(ApiResponse.success(article));
    }

    @GetMapping("/articles/slug/{slug}")
    public ResponseEntity<ApiResponse<KnowledgeArticle>> getArticleBySlug(@PathVariable String slug) {
        KnowledgeArticle article = knowledgeService.getArticleBySlug(slug, true);
        return ResponseEntity.ok(ApiResponse.success(article));
    }

    @PostMapping("/articles")
    public ResponseEntity<ApiResponse<KnowledgeArticle>> createArticle(@Valid @RequestBody CreateArticleRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String authorId = (auth != null && auth.isAuthenticated()) ? auth.getName() : null;
        KnowledgeArticle created = knowledgeService.createArticle(request, authorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Article created successfully"));
    }

    @PutMapping("/articles/{id}")
    public ResponseEntity<ApiResponse<KnowledgeArticle>> updateArticle(
            @PathVariable String id,
            @Valid @RequestBody UpdateArticleRequest request) {
        KnowledgeArticle updated = knowledgeService.updateArticle(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Article updated successfully"));
    }

    @PatchMapping("/articles/{id}/status")
    public ResponseEntity<ApiResponse<KnowledgeArticle>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        ArticleStatus status = ArticleStatus.valueOf(statusStr.toUpperCase());
        KnowledgeArticle updated = knowledgeService.updateArticleStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Article status updated to " + status));
    }

    @DeleteMapping("/articles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable String id) {
        knowledgeService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Article deleted successfully"));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryCountResponse>>> getCategories() {
        List<CategoryCountResponse> categories = knowledgeService.getCategoriesWithCounts();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<RagSourceItem>>> searchArticles(@Valid @RequestBody RagSearchRequest request) {
        List<RagSourceItem> results = knowledgeService.searchArticles(request);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<RagAskResponse>> askQuestion(@Valid @RequestBody RagAskRequest request) {
        RagAskResponse response = knowledgeService.askQuestion(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
