package com.crm.timeline;

import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TimelineTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private JwtProvider jwtProvider;

    private Organization org;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Timeline Test Org")
                    .domain("timelinetest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("timeline-agent", "agent@timelinetest.com", org.getId(), "ADMIN");
    }

    @Test
    void testTimelineEventRecordingAndQuerying() throws Exception {
        String testEntityId = "deal-enterprise-999";

        // 1. Record several chronological events for an entity
        timelineService.recordEvent(
                org.getId(),
                "DEAL",
                testEntityId,
                "DEAL_CREATED",
                "user-1",
                "Sarah Connor",
                "Opportunity Created",
                "Deal created for $250,000",
                Map.of("value", 250000)
        );

        timelineService.recordEvent(
                org.getId(),
                "DEAL",
                testEntityId,
                "PROPOSAL_SENT",
                "user-1",
                "Sarah Connor",
                "Contract Proposal Delivered",
                "Sent enterprise proposal v2.1 to client",
                Map.of("proposalVersion", "2.1")
        );

        // 2. Query Entity-specific Timeline
        mockMvc.perform(get("/api/v1/timeline/DEAL/" + testEntityId)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.data.content[0].entityId").value(testEntityId))
                .andExpect(jsonPath("$.data.content[0].title").isNotEmpty());

        // 3. Query Organization-wide Feed
        mockMvc.perform(get("/api/v1/timeline/feed")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", notNullValue()))
                .andExpect(jsonPath("$.data.totalElements", greaterThanOrEqualTo(2)));
    }
}
