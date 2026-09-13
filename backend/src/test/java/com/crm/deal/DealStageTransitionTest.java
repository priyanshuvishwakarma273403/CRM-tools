package com.crm.deal;

import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.pipeline.DealStageHistory;
import com.crm.pipeline.DealStageHistoryRepository;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DealStageTransitionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private DealStageHistoryRepository dealStageHistoryRepository;

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
                    .name("Deal Test Org")
                    .domain("dealtest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("deal-agent", "agent@dealtest.com", org.getId(), "SALES_AGENT");
    }

    @Test
    void testDealStageTransitionsAndHistory() throws Exception {
        // 1. Create a new Deal
        Deal deal = Deal.builder()
                .title("Enterprise Cloud Migration")
                .value(new BigDecimal("250000.00"))
                .currency("INR")
                .stage(DealStage.NEW)
                .probability(10)
                .expectedCloseDate(LocalDate.now().plusMonths(2))
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/v1/deals")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.pipelineId").exists())
                .andReturn();

        JsonNode createdJson = objectMapper.readTree(createResult.getResponse().getContentAsString());
        String dealId = createdJson.path("data").path("id").asText();
        assertNotNull(dealId);

        // 2. Transition Deal stage: NEW -> PROPOSAL
        Map<String, String> toProposal = Map.of(
                "stage", "PROPOSAL",
                "notes", "Proposal presented to VP of Engineering"
        );

        mockMvc.perform(patch("/api/v1/deals/" + dealId + "/stage")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(toProposal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.stage").value("PROPOSAL"));

        // 3. Transition Deal stage: PROPOSAL -> WON with win reason
        Map<String, String> toWon = Map.of(
                "stage", "WON",
                "winReason", "Competitive pricing and superior compliance features",
                "notes", "Contract signed"
        );

        mockMvc.perform(patch("/api/v1/deals/" + dealId + "/stage")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(toWon)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.stage").value("WON"))
                .andExpect(jsonPath("$.data.probability").value(100))
                .andExpect(jsonPath("$.data.winReason").value("Competitive pricing and superior compliance features"));

        // 4. Verify deal stage history was recorded
        List<DealStageHistory> histories = dealStageHistoryRepository.findByDealIdOrderByCreatedAtDesc(dealId);
        assertFalse(histories.isEmpty());
        assertTrue(histories.size() >= 3); // initial creation + to proposal + to won

        DealStageHistory latest = histories.get(0);
        assertEquals("WON", latest.getToStage());
        assertEquals("PROPOSAL", latest.getFromStage());
    }

    @Test
    void testDealTransitionToLostWithReason() throws Exception {
        Deal deal = Deal.builder()
                .title("Legacy On-Premise Upgrade")
                .value(new BigDecimal("80000.00"))
                .currency("INR")
                .stage(DealStage.QUALIFIED)
                .probability(25)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/v1/deals")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deal)))
                .andExpect(status().isOk())
                .andReturn();

        String dealId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .path("data").path("id").asText();

        Map<String, String> toLost = Map.of(
                "stage", "LOST",
                "lossReason", "Budget allocated to other internal project",
                "notes", "Client deferred to next fiscal year"
        );

        mockMvc.perform(patch("/api/v1/deals/" + dealId + "/stage")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(toLost)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.stage").value("LOST"))
                .andExpect(jsonPath("$.data.probability").value(0))
                .andExpect(jsonPath("$.data.lossReason").value("Budget allocated to other internal project"));
    }
}
