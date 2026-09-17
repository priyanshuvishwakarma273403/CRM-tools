package com.crm.knowledge.rag;

import com.crm.knowledge.ArticleStatus;
import com.crm.knowledge.KnowledgeArticle;
import com.crm.knowledge.KnowledgeArticleRepository;
import com.crm.knowledge.dto.RagAskResponse;
import com.crm.knowledge.dto.RagSourceItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RagRetrievalService {

    private final EmbeddingChunkRepository embeddingChunkRepository;
    private final KnowledgeArticleRepository knowledgeArticleRepository;
    private final VectorEmbeddingService vectorEmbeddingService;

    /**
     * Executes hybrid semantic (vector cosine similarity) + lexical (keyword matching) retrieval.
     */
    public List<RagSourceItem> hybridSearch(String orgId, String query, String category, int limit) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }

        double[] queryVector = vectorEmbeddingService.computeEmbeddingVector(query);

        Set<String> queryTerms = Arrays.stream(query.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+"))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toSet());

        List<KnowledgeArticle> articles = knowledgeArticleRepository.findAllByOrganizationId(orgId);
        Map<String, KnowledgeArticle> articleMap = articles.stream()
                .collect(Collectors.toMap(KnowledgeArticle::getId, a -> a, (a, b) -> a));

        List<EmbeddingChunk> chunks = embeddingChunkRepository.findAllByOrganizationIdAndEntityType(orgId, "KNOWLEDGE_ARTICLE");

        List<RagSourceItem> scoredResults = new ArrayList<>();

        for (EmbeddingChunk chunk : chunks) {
            KnowledgeArticle article = articleMap.get(chunk.getEntityId());
            if (article == null || article.getStatus() != ArticleStatus.PUBLISHED) {
                continue;
            }

            if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
                if (!category.equalsIgnoreCase(article.getCategory())) {
                    continue;
                }
            }

            double[] chunkVector = vectorEmbeddingService.parseVector(chunk.getVectorData());
            double cosine = vectorEmbeddingService.cosineSimilarity(queryVector, chunkVector);

            String combinedText = (chunk.getContentChunk() + " " + article.getTitle() + " " + (article.getTags() != null ? article.getTags() : "")).toLowerCase();
            double lexical = 0.0;
            if (!queryTerms.isEmpty()) {
                long matches = queryTerms.stream().filter(combinedText::contains).count();
                lexical = (double) matches / queryTerms.size();
            }

            // Weighted Hybrid Score: 70% vector semantic similarity, 30% lexical keyword overlap
            double hybridScore = (0.7 * cosine) + (0.3 * lexical);

            if (hybridScore > 0.05) {
                scoredResults.add(RagSourceItem.builder()
                        .articleId(article.getId())
                        .title(article.getTitle())
                        .category(article.getCategory())
                        .chunk(chunk.getContentChunk())
                        .similarityScore(Math.round(hybridScore * 10000.0) / 10000.0)
                        .build());
            }
        }

        return scoredResults.stream()
                .sorted(Comparator.comparing(RagSourceItem::getSimilarityScore).reversed())
                .limit(Math.max(1, limit))
                .collect(Collectors.toList());
    }

    /**
     * Answers questions grounded strictly in retrieved knowledge base articles.
     */
    public RagAskResponse answerQuestion(String orgId, String question, String category) {
        if (question == null || question.isBlank()) {
            return RagAskResponse.builder()
                    .question(question)
                    .answer("Please provide a question to search the knowledge base.")
                    .confidenceScore(0.0)
                    .sources(Collections.emptyList())
                    .build();
        }

        List<RagSourceItem> sources = hybridSearch(orgId, question, category, 3);

        if (sources.isEmpty() || sources.get(0).getSimilarityScore() < 0.1) {
            return RagAskResponse.builder()
                    .question(question)
                    .answer("I could not find any relevant information in the knowledge base to answer this question.")
                    .confidenceScore(sources.isEmpty() ? 0.0 : sources.get(0).getSimilarityScore())
                    .sources(sources)
                    .build();
        }

        RagSourceItem topSource = sources.get(0);
        StringBuilder answer = new StringBuilder();
        answer.append("Based on our knowledge article \"")
                .append(topSource.getTitle())
                .append("\" (")
                .append(topSource.getCategory())
                .append("):\n\n")
                .append(topSource.getChunk().trim());

        if (sources.size() > 1 && sources.get(1).getSimilarityScore() > 0.25 && !sources.get(1).getArticleId().equals(topSource.getArticleId())) {
            answer.append("\n\nAdditionally, reference \"")
                    .append(sources.get(1).getTitle())
                    .append("\":\n")
                    .append(sources.get(1).getChunk().trim());
        }

        return RagAskResponse.builder()
                .question(question)
                .answer(answer.toString())
                .confidenceScore(topSource.getSimilarityScore())
                .sources(sources)
                .build();
    }
}
