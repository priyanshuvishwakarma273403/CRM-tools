package com.crm.communication;

import com.crm.communication.dto.InboundMessageRequest;
import com.crm.lead.Lead;
import com.crm.lead.LeadRepository;
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
public class InboundCommunicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private Organization org;
    private Lead lead;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Inbound Test Org")
                    .domain("inboundtest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("inbound-agent", "agent@inboundtest.com", org.getId(), "SALES_AGENT");

        lead = leadRepository.save(Lead.builder()
                .organization(org)
                .firstName("Michael")
                .lastName("Scott")
                .companyName("Dunder Mifflin")
                .email("michael.scott@dundermifflin.com")
                .phone("+1555123456")
                .build());
    }

    @Test
    void testInboundMessageAutoResolution() throws Exception {
        InboundMessageRequest req = InboundMessageRequest.builder()
                .channel("EMAIL")
                .sender("michael.scott@dundermifflin.com")
                .subject("Inquiry about Paper Subscription")
                .content("Hello, I would like to inquire about enterprise discounts for our Scranton branch.")
                .build();

        mockMvc.perform(post("/api/v1/communications/inbound")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.direction").value("INBOUND"))
                .andExpect(jsonPath("$.data.status").value("RECEIVED"))
                .andExpect(jsonPath("$.data.lead.id").value(lead.getId()));
    }

    @Test
    void testInboundMessageSentimentAnalysis() throws Exception {
        InboundMessageRequest req = InboundMessageRequest.builder()
                .channel("SMS")
                .sender("+1555123456")
                .content("Your service is completely broken and failed to connect. Urgent error, cancel immediately!")
                .build();

        mockMvc.perform(post("/api/v1/communications/inbound")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sentiment").value("NEGATIVE"));
    }
}
