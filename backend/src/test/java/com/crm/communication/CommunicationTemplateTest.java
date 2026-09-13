package com.crm.communication;

import com.crm.communication.dto.CreateTemplateRequest;
import com.crm.communication.dto.RenderTemplateRequest;
import com.crm.communication.dto.SendMessageRequest;
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
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CommunicationTemplateTest {

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
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Template Test Org")
                    .domain("templatetest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("template-agent", "agent@templatetest.com", org.getId(), "SALES_AGENT");
    }

    @Test
    void testTemplateCreationRenderingAndSending() throws Exception {
        // 1. Create a dynamic communication template
        CreateTemplateRequest createReq = CreateTemplateRequest.builder()
                .name("Quarterly Business Review Invitation")
                .channel("EMAIL")
                .subject("QBR Invitation for {{companyName}}")
                .bodyTemplate("Hello {{firstName}},\n\nYou are invited to our Quarterly Business Review for {{companyName}}.\nBest regards,\n{{senderName}}")
                .variables(List.of("firstName", "companyName", "senderName"))
                .category("SALES_PITCH")
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/v1/communications/templates")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").exists())
                .andReturn();

        String templateId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .path("data").path("id").asText();
        assertNotNull(templateId);

        // 2. Render the template with dynamic variables
        RenderTemplateRequest renderReq = RenderTemplateRequest.builder()
                .variables(Map.of(
                        "firstName", "Rachel",
                        "companyName", "Nexus Global",
                        "senderName", "Account Team"
                ))
                .build();

        mockMvc.perform(post("/api/v1/communications/templates/" + templateId + "/render")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(renderReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.renderedSubject").value("QBR Invitation for Nexus Global"))
                .andExpect(jsonPath("$.data.renderedBody", containsString("Hello Rachel,")))
                .andExpect(jsonPath("$.data.renderedBody", containsString("Nexus Global")));

        // 3. Send message using the template
        SendMessageRequest sendReq = SendMessageRequest.builder()
                .channel("EMAIL")
                .recipient("rachel@nexus.io")
                .templateId(templateId)
                .templateVariables(Map.of(
                        "firstName", "Rachel",
                        "companyName", "Nexus Global",
                        "senderName", "Account Team"
                ))
                .build();

        mockMvc.perform(post("/api/v1/communications/send")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.subject").value("QBR Invitation for Nexus Global"))
                .andExpect(jsonPath("$.data.content", containsString("Hello Rachel,")))
                .andExpect(jsonPath("$.data.status").value("SENT"));
    }
}
