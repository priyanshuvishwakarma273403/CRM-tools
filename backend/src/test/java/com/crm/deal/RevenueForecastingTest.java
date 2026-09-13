package com.crm.deal;

import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RevenueForecastingTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private JwtProvider jwtProvider;

    private Organization org;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Forecast Test Org")
                    .domain("forecasttest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("sales-vp", "vp@forecasttest.com", org.getId(), "MANAGER");

        // Seed sample deals for forecast calculation
        dealRepository.save(Deal.builder()
                .organization(org)
                .title("High Probability Renewal")
                .value(new BigDecimal("100000.00"))
                .stage(DealStage.NEGOTIATION)
                .probability(85)
                .expectedCloseDate(LocalDate.now().plusDays(5))
                .build());

        dealRepository.save(Deal.builder()
                .organization(org)
                .title("Early Discovery Deal")
                .value(new BigDecimal("50000.00"))
                .stage(DealStage.QUALIFIED)
                .probability(25)
                .expectedCloseDate(LocalDate.now().plusDays(40))
                .build());
    }

    @Test
    void testPipelineMetricsEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/deals/pipeline-metrics")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalPipelineValue").exists())
                .andExpect(jsonPath("$.data.weightedPipelineValue").exists())
                .andExpect(jsonPath("$.data.winRate").exists())
                .andExpect(jsonPath("$.data.stages", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void testRevenueForecastEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/deals/forecast")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalProjectedRevenue").exists())
                .andExpect(jsonPath("$.data.currentMonth").exists())
                .andExpect(jsonPath("$.data.currentMonth.commit").exists())
                .andExpect(jsonPath("$.data.currentQuarter").exists())
                .andExpect(jsonPath("$.data.fullYear").exists());
    }
}
