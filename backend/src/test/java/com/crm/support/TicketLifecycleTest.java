package com.crm.support;

import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import com.crm.support.dto.AddCommentRequest;
import com.crm.support.dto.CreateTicketRequest;
import com.crm.support.dto.CsatFeedbackRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TicketLifecycleTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private TicketRepository ticketRepository;

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
                    .name("Support Test Org")
                    .domain("supporttest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("support-agent", "agent@supporttest.com", org.getId(), "SUPPORT_AGENT");
    }

    @Test
    void testCompleteTicketLifecycleAndSla() throws Exception {
        // 1. Create a High Priority Support Ticket
        CreateTicketRequest createRequest = CreateTicketRequest.builder()
                .subject("API Gateway 502 Bad Gateway during load spike")
                .description("Production traffic encountering 502 errors on webhook ingestion service.")
                .priority(TicketPriority.HIGH)
                .category("INFRASTRUCTURE")
                .build();

        String createResponse = mockMvc.perform(post("/api/v1/tickets")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNotEmpty())
                .andExpect(jsonPath("$.data.ticketNumber", startsWith("TCK-")))
                .andExpect(jsonPath("$.data.status").value("OPEN"))
                .andExpect(jsonPath("$.data.priority").value("HIGH"))
                .andExpect(jsonPath("$.data.slaDueAt").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        String ticketId = objectMapper.readTree(createResponse).path("data").path("id").asText();

        // 2. Add an Internal Comment
        AddCommentRequest internalComment = AddCommentRequest.builder()
                .body("Investigating upstream load balancer connection timeouts.")
                .isInternal(true)
                .build();

        mockMvc.perform(post("/api/v1/tickets/" + ticketId + "/comments")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(internalComment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isInternal").value(true));

        // 3. Add a Customer-facing Comment (Sets firstRespondedAt)
        AddCommentRequest publicComment = AddCommentRequest.builder()
                .body("We have identified the root cause and deployed a mitigation hotfix.")
                .isInternal(false)
                .build();

        mockMvc.perform(post("/api/v1/tickets/" + ticketId + "/comments")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(publicComment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isInternal").value(false));

        // 4. Resolve the Ticket
        mockMvc.perform(patch("/api/v1/tickets/" + ticketId + "/status")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "RESOLVED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("RESOLVED"))
                .andExpect(jsonPath("$.data.resolvedAt").isNotEmpty());

        // 5. Submit CSAT Rating
        CsatFeedbackRequest csat = CsatFeedbackRequest.builder()
                .rating(5)
                .comment("Outstanding and rapid incident resolution!")
                .build();

        mockMvc.perform(post("/api/v1/tickets/" + ticketId + "/csat")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(csat)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.csatRating").value(5))
                .andExpect(jsonPath("$.data.csatComment").value("Outstanding and rapid incident resolution!"));

        // 6. Query Support Metrics
        mockMvc.perform(get("/api/v1/tickets/metrics")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.resolved", greaterThanOrEqualTo(1)));
    }
}
