package com.crm.performance;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Enterprise Performance Engine Gateway.
 * Bridges Spring Boot to the Rust Native Accelerator (Port 50051).
 * Features zero-overhead fallback to high-efficiency Java algorithms when native engine is offline.
 */
@Slf4j
@Service
public class PerformanceServiceClient {

    private final RestTemplate restTemplate;
    private final String performanceEngineUrl;

    public PerformanceServiceClient(@Value("${crm.performance.service-url:http://localhost:50051}") String performanceEngineUrl) {
        this.performanceEngineUrl = performanceEngineUrl;
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> findDuplicates(Map<String, Object> query) {
        String endpoint = performanceEngineUrl + "/dedup/match";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(query, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Map<String, Object>) response.getBody();
            }
        } catch (Exception e) {
            log.warn("Rust performance engine offline, executing Java Jaro-Winkler fallback: {}", e.getMessage());
        }

        // High-efficiency in-JVM Java implementation
        long start = System.nanoTime();
        String targetName = (String) query.getOrDefault("target_name", "");
        String targetEmail = (String) query.get("target_email");
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) query.getOrDefault("candidates", List.of());
        double threshold = ((Number) query.getOrDefault("threshold", 0.80)).doubleValue();

        List<Map<String, Object>> matches = new ArrayList<>();
        for (Map<String, Object> c : candidates) {
            String name = (String) c.getOrDefault("name", "");
            double nameSim = calculateJaroWinkler(targetName, name);
            double score = nameSim * 0.7;

            List<String> reasons = new ArrayList<>();
            if (nameSim >= 0.85) {
                reasons.add(String.format("High name similarity (%.1f%%)", nameSim * 100));
            }

            String cEmail = (String) c.get("email");
            if (targetEmail != null && cEmail != null && targetEmail.equalsIgnoreCase(cEmail)) {
                score += 0.3;
                reasons.add("Identical email address");
            }

            if (score >= threshold) {
                matches.add(Map.of(
                        "candidate_id", c.getOrDefault("id", ""),
                        "name", name,
                        "match_score", Math.round(score * 100.0) / 100.0,
                        "match_reasons", reasons
                ));
            }
        }

        long elapsedMicros = (System.nanoTime() - start) / 1000;
        return Map.of(
                "matches", matches,
                "processed_count", candidates.size(),
                "execution_time_micros", elapsedMicros,
                "engine", "JAVA_IN_JVM_FALLBACK"
        );
    }

    public Map<String, Object> simulateMonteCarlo(Map<String, Object> query) {
        String endpoint = performanceEngineUrl + "/math/pipeline-forecast";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(query, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Map<String, Object>) response.getBody();
            }
        } catch (Exception e) {
            log.warn("Rust performance engine offline, executing Java Monte Carlo simulation: {}", e.getMessage());
        }

        // Fast Java Monte Carlo fallback
        long start = System.nanoTime();
        List<Map<String, Object>> deals = (List<Map<String, Object>>) query.getOrDefault("deals", List.of());
        int n = ((Number) query.getOrDefault("iterations", 10000)).intValue();
        double[] results = new double[n];

        for (int i = 0; i < n; i++) {
            double simRevenue = 0.0;
            for (Map<String, Object> deal : deals) {
                double val = ((Number) deal.getOrDefault("value", 0.0)).doubleValue();
                double prob = ((Number) deal.getOrDefault("base_probability", 0.5)).doubleValue();
                if (ThreadLocalRandom.current().nextDouble() <= prob) {
                    simRevenue += val;
                }
            }
            results[i] = simRevenue;
        }

        Arrays.sort(results);
        double p10 = results[(int) (n * 0.10)];
        double p50 = results[(int) (n * 0.50)];
        double p90 = results[(int) (n * 0.90)];
        double sum = 0;
        for (double r : results) sum += r;
        double mean = sum / n;

        long elapsedMicros = (System.nanoTime() - start) / 1000;
        return Map.of(
                "p10_revenue", Math.round(p10 * 100.0) / 100.0,
                "p50_revenue", Math.round(p50 * 100.0) / 100.0,
                "p90_revenue", Math.round(p90 * 100.0) / 100.0,
                "mean_revenue", Math.round(mean * 100.0) / 100.0,
                "iterations_run", n,
                "execution_time_micros", elapsedMicros,
                "engine", "JAVA_IN_JVM_FALLBACK"
        );
    }

    private double calculateJaroWinkler(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();
        if (s1.equals(s2)) return 1.0;
        int len1 = s1.length();
        int len2 = s2.length();
        if (len1 == 0 || len2 == 0) return 0.0;

        int matchDistance = Math.max(len1, len2) / 2 - 1;
        boolean[] s1Matches = new boolean[len1];
        boolean[] s2Matches = new boolean[len2];

        int matches = 0;
        for (int i = 0; i < len1; i++) {
            int start = Math.max(0, i - matchDistance);
            int end = Math.min(i + matchDistance + 1, len2);
            for (int j = start; j < end; j++) {
                if (s2Matches[j] || s1.charAt(i) != s2.charAt(j)) continue;
                s1Matches[i] = true;
                s2Matches[j] = true;
                matches++;
                break;
            }
        }
        if (matches == 0) return 0.0;

        int transpositions = 0;
        int k = 0;
        for (int i = 0; i < len1; i++) {
            if (!s1Matches[i]) continue;
            while (!s2Matches[k]) k++;
            if (s1.charAt(i) != s2.charAt(k)) transpositions++;
            k++;
        }

        double m = matches;
        double jaro = ((m / len1) + (m / len2) + ((m - transpositions / 2.0) / m)) / 3.0;
        int prefix = 0;
        for (int i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
            if (s1.charAt(i) == s2.charAt(i)) prefix++;
            else break;
        }
        return jaro + prefix * 0.1 * (1.0 - jaro);
    }
}
