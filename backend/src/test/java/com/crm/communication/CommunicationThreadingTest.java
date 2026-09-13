package com.crm.communication;

import com.crm.communication.dto.SendMessageRequest;
import com.crm.customer.Customer;
import com.crm.customer.CustomerRepository;
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
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CommunicationThreadingTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private Organization org;
    private Customer customer;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Comm Test Org")
                    .domain("commtest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("comm-agent", "agent@commtest.com", org.getId(), "SALES_AGENT");

        customer = customerRepository.findAllByOrganizationId(org.getId()).stream().findFirst().orElseGet(() -> {
            Customer newCust = Customer.builder()
                    .organizationId(org.getId())
                    .name("Acme Comm Client")
                    .status("ACTIVE")
                    .build();
            return customerRepository.save(newCust);
        });
    }

    @Test
    void testOutboundAndReplyThreading() throws Exception {
        // 1. Send initial outbound message
        SendMessageRequest initialReq = SendMessageRequest.builder()
                .channel("EMAIL")
                .recipient("client@acme.com")
                .subject("Project Roadmap Discussion")
                .content("Hi team, let us align on the Q4 release dates.")
                .customerId(customer.getId())
                .build();

        MvcResult firstMsgResult = mockMvc.perform(post("/api/v1/communications/send")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initialReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.threadId").exists())
                .andReturn();

        JsonNode firstMsgJson = objectMapper.readTree(firstMsgResult.getResponse().getContentAsString()).path("data");
        String firstMsgId = firstMsgJson.path("id").asText();
        String threadId = firstMsgJson.path("threadId").asText();

        assertNotNull(firstMsgId);
        assertNotNull(threadId);

        // 2. Send follow-up reply in same thread
        SendMessageRequest replyReq = SendMessageRequest.builder()
                .channel("EMAIL")
                .recipient("client@acme.com")
                .subject("Re: Project Roadmap Discussion")
                .content("Attached is the draft schedule.")
                .threadId(threadId)
                .parentId(firstMsgId)
                .customerId(customer.getId())
                .build();

        mockMvc.perform(post("/api/v1/communications/send")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(replyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.threadId").value(threadId))
                .andExpect(jsonPath("$.data.parentId").value(firstMsgId));

        // 3. Fetch thread conversation
        mockMvc.perform(get("/api/v1/communications/thread/" + threadId)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id").value(firstMsgId))
                .andExpect(jsonPath("$.data[1].parentId").value(firstMsgId));

        // 4. Fetch customer communication timeline
        mockMvc.perform(get("/api/v1/communications/customer/" + customer.getId())
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(2))));
    }
}
