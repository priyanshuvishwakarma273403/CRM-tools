package com.crm.knowledge;

import com.crm.knowledge.dto.CreateArticleRequest;
import com.crm.knowledge.dto.RagAskRequest;
import com.crm.knowledge.dto.RagSearchRequest;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RagRetrievalEngineTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private Organization org;
    private String token;

    @BeforeEach
    void setUp() throws Exception {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("RAG Test Org")
                    .domain("ragtest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("rag-agent", "agent@ragtest.com", org.getId(), "AGENT");

        // Seed 2 distinct articles
        CreateArticleRequest refundArticle = CreateArticleRequest.builder()
                .title("Customer Refund & Cancellation SLA Policy")
                .content("Refund requests are reviewed within 48 business hours. Approved refunds are credited back to the original payment method within 5 to 7 business days.")
                .category("BILLING")
                .tags("refund,cancellation,billing,sla")
                .build();

        mockMvc.perform(post("/api/v1/knowledge/articles")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refundArticle)));

        CreateArticleRequest databaseArticle = CreateArticleRequest.builder()
                .title("PostgreSQL Read Replicas & Connection Pooling")
                .content("We use PgBouncer in transaction pooling mode. Read queries are routed to read replicas with streaming replication lag maintained under 100ms.")
                .category("INFRASTRUCTURE")
                .tags("database,postgres,replication,performance")
                .build();

        mockMvc.perform(post("/api/v1/knowledge/articles")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(databaseArticle)));
    }

    @Test
    void testHybridVectorSearchReturnsRankedSemanticResults() throws Exception {
        RagSearchRequest searchReq = RagSearchRequest.builder()
                .query("How many days does a refund take to process?")
                .category("BILLING")
                .limit(3)
                .build();

        mockMvc.perform(post("/api/v1/knowledge/search")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(searchReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].title").value("Customer Refund & Cancellation SLA Policy"))
                .andExpect(jsonPath("$.data[0].category").value("BILLING"))
                .andExpect(jsonPath("$.data[0].similarityScore", greaterThan(0.1)));
    }

    @Test
    void testGroundedQuestionAnsweringSynthesizesAnswerWithCitations() throws Exception {
        RagAskRequest askReq = RagAskRequest.builder()
                .question("What is the timeframe for approving and crediting customer refunds?")
                .build();

        mockMvc.perform(post("/api/v1/knowledge/ask")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(askReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.question").value("What is the timeframe for approving and crediting customer refunds?"))
                .andExpect(jsonPath("$.data.answer", containsString("Customer Refund & Cancellation SLA Policy")))
                .andExpect(jsonPath("$.data.answer", containsString("48 business hours")))
                .andExpect(jsonPath("$.data.confidenceScore", greaterThan(0.1)))
                .andExpect(jsonPath("$.data.sources", hasSize(greaterThanOrEqualTo(1))));
    }
}
