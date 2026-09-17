package com.crm.knowledge;

import com.crm.knowledge.dto.CreateArticleRequest;
import com.crm.knowledge.dto.RagAskRequest;
import com.crm.knowledge.dto.RagSearchRequest;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class KnowledgeMultiTenantTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private Organization orgAlpha;
    private Organization orgBeta;
    private String tokenAlpha;
    private String tokenBeta;

    @BeforeEach
    void setUp() {
        orgAlpha = organizationRepository.save(Organization.builder()
                .name("Alpha Corp")
                .domain("alpha-" + System.currentTimeMillis() + ".com")
                .build());

        orgBeta = organizationRepository.save(Organization.builder()
                .name("Beta Corp")
                .domain("beta-" + System.currentTimeMillis() + ".com")
                .build());

        tokenAlpha = "Bearer " + jwtProvider.generateAccessToken("user-alpha", "alpha@corp.com", orgAlpha.getId(), "ADMIN");
        tokenBeta = "Bearer " + jwtProvider.generateAccessToken("user-beta", "beta@corp.com", orgBeta.getId(), "ADMIN");
    }

    @Test
    void testTenantDataAndRagIsolation() throws Exception {
        // 1. Org Alpha publishes a private strategy article
        CreateArticleRequest alphaArticle = CreateArticleRequest.builder()
                .title("Alpha Secret Project Andromeda Guidelines")
                .content("Project Andromeda involves autonomous drone delivery logistics operating exclusively under patent 998822.")
                .category("STRATEGY")
                .build();

        MvcResult createRes = mockMvc.perform(post("/api/v1/knowledge/articles")
                        .header("Authorization", tokenAlpha)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alphaArticle)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode alphaNode = objectMapper.readTree(createRes.getResponse().getContentAsString()).path("data");
        String alphaId = alphaNode.path("id").asText();
        String alphaSlug = alphaNode.path("slug").asText();

        // 2. Org Beta cannot access Org Alpha's article by ID
        mockMvc.perform(get("/api/v1/knowledge/articles/" + alphaId)
                        .header("Authorization", tokenBeta))
                .andExpect(status().isNotFound());

        // 3. Org Beta cannot access Org Alpha's article by slug
        mockMvc.perform(get("/api/v1/knowledge/articles/slug/" + alphaSlug)
                        .header("Authorization", tokenBeta))
                .andExpect(status().isNotFound());

        // 4. Org Beta cannot retrieve Org Alpha's chunks through RAG search
        RagSearchRequest betaSearch = RagSearchRequest.builder()
                .query("Project Andromeda drone delivery")
                .build();

        mockMvc.perform(post("/api/v1/knowledge/search")
                        .header("Authorization", tokenBeta)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(betaSearch)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));

        // 5. Org Beta QA cannot leak Org Alpha's content
        RagAskRequest betaAsk = RagAskRequest.builder()
                .question("What patent does Project Andromeda operate under?")
                .build();

        mockMvc.perform(post("/api/v1/knowledge/ask")
                        .header("Authorization", tokenBeta)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(betaAsk)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.answer", containsString("could not find any relevant information")))
                .andExpect(jsonPath("$.data.sources", hasSize(0)));
    }
}
