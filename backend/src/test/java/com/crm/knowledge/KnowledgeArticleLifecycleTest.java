package com.crm.knowledge;

import com.crm.knowledge.dto.CreateArticleRequest;
import com.crm.knowledge.dto.UpdateArticleRequest;
import com.crm.knowledge.rag.EmbeddingChunk;
import com.crm.knowledge.rag.EmbeddingChunkRepository;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class KnowledgeArticleLifecycleTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private KnowledgeArticleRepository knowledgeArticleRepository;

    @Autowired
    private EmbeddingChunkRepository embeddingChunkRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private Organization org;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Knowledge Test Org")
                    .domain("knowledgetest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("kb-admin", "admin@knowledgetest.com", org.getId(), "ADMIN");
    }

    @Test
    void testCompleteArticleLifecycleAndEmbeddings() throws Exception {
        // 1. Create Article
        CreateArticleRequest createReq = CreateArticleRequest.builder()
                .title("Enterprise Security & Encryption Architecture")
                .content("All customer data is encrypted at rest using AES-256 and in transit via TLS 1.3. Role-based access control enforces least privilege.")
                .category("SECURITY")
                .tags("security,encryption,compliance")
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/v1/knowledge/articles")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("enterprise-security-encryption-architecture"))
                .andExpect(jsonPath("$.data.category").value("SECURITY"))
                .andExpect(jsonPath("$.data.viewCount").value(0))
                .andReturn();

        JsonNode createdNode = objectMapper.readTree(createResult.getResponse().getContentAsString()).path("data");
        String articleId = createdNode.path("id").asText();
        String slug = createdNode.path("slug").asText();

        // Verify RAG embedding chunks were automatically generated
        List<EmbeddingChunk> chunks = embeddingChunkRepository.findByOrganizationIdAndEntityIdAndEntityType(
                org.getId(), articleId, "KNOWLEDGE_ARTICLE"
        );
        assertFalse(chunks.isEmpty(), "Embedding chunks should have been indexed upon article creation");
        assertNotNull(chunks.get(0).getVectorData(), "Embedding vector data should be populated");

        // 2. Retrieve by ID (increments view count)
        mockMvc.perform(get("/api/v1/knowledge/articles/" + articleId)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.viewCount").value(1));

        // 3. Retrieve by Slug (increments view count again)
        mockMvc.perform(get("/api/v1/knowledge/articles/slug/" + slug)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.viewCount").value(2));

        // 4. Update Article Title and Content
        UpdateArticleRequest updateReq = UpdateArticleRequest.builder()
                .title("Updated Security and SOC-2 Compliance")
                .content("SOC-2 Type II certified data centers with continuous audit logs and intrusion detection systems.")
                .build();

        mockMvc.perform(put("/api/v1/knowledge/articles/" + articleId)
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("updated-security-and-soc-2-compliance"));

        // 5. Update Status to ARCHIVED
        mockMvc.perform(patch("/api/v1/knowledge/articles/" + articleId + "/status")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "ARCHIVED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ARCHIVED"));

        // 6. Query Categories
        mockMvc.perform(get("/api/v1/knowledge/categories")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        // 7. Delete Article and verify embedding cleanup
        mockMvc.perform(delete("/api/v1/knowledge/articles/" + articleId)
                        .header("Authorization", token))
                .andExpect(status().isOk());

        assertTrue(knowledgeArticleRepository.findById(articleId).isEmpty());
        List<EmbeddingChunk> remainingChunks = embeddingChunkRepository.findByOrganizationIdAndEntityIdAndEntityType(
                org.getId(), articleId, "KNOWLEDGE_ARTICLE"
        );
        assertTrue(remainingChunks.isEmpty(), "Embedding chunks should be deleted when the article is deleted");
    }
}
