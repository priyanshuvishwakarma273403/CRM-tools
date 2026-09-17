package com.crm.knowledge.rag;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class VectorEmbeddingService {

    public static final int VECTOR_DIMENSIONS = 64;
    private final ObjectMapper objectMapper;

    public VectorEmbeddingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Splits long text into semantically cohesive chunks of approximately targetChunkSize.
     */
    public List<String> chunkText(String text, int targetChunkSize) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }

        List<String> chunks = new ArrayList<>();
        String[] paragraphs = text.split("\n\n+");

        StringBuilder currentChunk = new StringBuilder();
        for (String para : paragraphs) {
            String cleanPara = para.trim();
            if (cleanPara.isEmpty()) continue;

            if (currentChunk.length() + cleanPara.length() > targetChunkSize && currentChunk.length() > 0) {
                chunks.add(currentChunk.toString().trim());
                currentChunk = new StringBuilder();
            }

            if (cleanPara.length() > targetChunkSize) {
                // Split long paragraphs by sentences
                String[] sentences = cleanPara.split("(?<=[.?!])\\s+");
                for (String sentence : sentences) {
                    if (currentChunk.length() + sentence.length() > targetChunkSize && currentChunk.length() > 0) {
                        chunks.add(currentChunk.toString().trim());
                        currentChunk = new StringBuilder();
                    }
                    if (currentChunk.length() > 0) currentChunk.append(" ");
                    currentChunk.append(sentence);
                }
            } else {
                if (currentChunk.length() > 0) currentChunk.append("\n\n");
                currentChunk.append(cleanPara);
            }
        }

        if (currentChunk.length() > 0) {
            chunks.add(currentChunk.toString().trim());
        }

        return chunks.isEmpty() ? List.of(text) : chunks;
    }

    /**
     * Generates a normalized dense vector embedding using term hashing and frequency projection.
     * Returns JSON array string representation.
     */
    public String computeEmbeddingJson(String text) {
        double[] vector = computeEmbeddingVector(text);
        try {
            return objectMapper.writeValueAsString(vector);
        } catch (Exception e) {
            log.warn("Failed to serialize embedding vector: {}", e.getMessage());
            return "[]";
        }
    }

    /**
     * Computes a normalized L2 dense vector for the given text.
     */
    public double[] computeEmbeddingVector(String text) {
        double[] vector = new double[VECTOR_DIMENSIONS];
        if (text == null || text.isBlank()) {
            return vector;
        }

        String[] tokens = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        Map<String, Integer> termFrequencies = new HashMap<>();
        for (String t : tokens) {
            if (t.length() > 1) {
                termFrequencies.put(t, termFrequencies.getOrDefault(t, 0) + 1);
            }
        }

        for (Map.Entry<String, Integer> entry : termFrequencies.entrySet()) {
            String term = entry.getKey();
            int freq = entry.getValue();
            int hash = Math.abs(term.hashCode());
            int idx = hash % VECTOR_DIMENSIONS;
            double sign = ((hash >> 3) & 1) == 0 ? 1.0 : -1.0;
            double weight = Math.log(1.0 + freq) * (1.0 + 1.0 / term.length());
            vector[idx] += sign * weight;
        }

        // Normalize to L2 unit length
        double norm = 0.0;
        for (double v : vector) {
            norm += v * v;
        }
        norm = Math.sqrt(norm);
        if (norm > 1e-9) {
            for (int i = 0; i < vector.length; i++) {
                vector[i] = Math.round((vector[i] / norm) * 10000.0) / 10000.0;
            }
        }

        return vector;
    }

    /**
     * Computes Cosine Similarity between two unit-normalized vectors.
     * Result range: [-1.0, 1.0], with 1.0 being identical.
     */
    public double cosineSimilarity(double[] vecA, double[] vecB) {
        if (vecA == null || vecB == null || vecA.length == 0 || vecB.length == 0) {
            return 0.0;
        }
        int len = Math.min(vecA.length, vecB.length);
        double dotProduct = 0.0;
        for (int i = 0; i < len; i++) {
            dotProduct += vecA[i] * vecB[i];
        }
        return Math.max(0.0, Math.min(1.0, dotProduct));
    }

    public double[] parseVector(String vectorJson) {
        if (vectorJson == null || vectorJson.isBlank()) {
            return new double[0];
        }
        try {
            return objectMapper.readValue(vectorJson, double[].class);
        } catch (Exception e) {
            return new double[0];
        }
    }
}
