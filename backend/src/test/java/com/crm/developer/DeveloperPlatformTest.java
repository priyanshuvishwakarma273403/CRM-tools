package com.crm.developer;

import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DeveloperPlatformTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String testOrgId;

    @BeforeEach
    void setUp() {
        Organization org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Test Dev Org")
                    .domain("testdev.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        testOrgId = org.getId();
        TenantContext.setCurrentTenant(testOrgId);
    }

    @Test
    @WithMockUser(username = "dev-admin", roles = {"ADMIN"})
    void testApiKeyLifecycle() throws Exception {
        // 1. Create API key
        Map<String, Object> req = Map.of(
                "name", "Integration Pipeline Key",
                "scopes", "read:all,write:leads",
                "rateLimitPerMinute", 200,
                "validDays", 90
        );

        String createRes = mockMvc.perform(post("/api/v1/developer/api-keys")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Integration Pipeline Key"))
                .andExpect(jsonPath("$.data.rawKey").exists())
                .andExpect(jsonPath("$.data.keyPrefix").exists())
                .andReturn().getResponse().getContentAsString();

        Map respMap = objectMapper.readValue(createRes, Map.class);
        Map data = (Map) respMap.get("data");
        String keyId = (String) data.get("id");

        // 2. List API keys
        mockMvc.perform(get("/api/v1/developer/api-keys"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        // 3. Revoke API key
        mockMvc.perform(delete("/api/v1/developer/api-keys/" + keyId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "dev-admin", roles = {"ADMIN"})
    void testWebhookLifecycle() throws Exception {
        // 1. Create Webhook
        Map<String, Object> req = Map.of(
                "url", "https://example.com/crm-webhook-receiver",
                "events", List.of("lead.created", "deal.won")
        );

        String createRes = mockMvc.perform(post("/api/v1/developer/webhooks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.url").value("https://example.com/crm-webhook-receiver"))
                .andExpect(jsonPath("$.data.secret").exists())
                .andReturn().getResponse().getContentAsString();

        Map respMap = objectMapper.readValue(createRes, Map.class);
        Map data = (Map) respMap.get("data");
        String webhookId = (String) data.get("id");

        // 2. List Webhooks
        mockMvc.perform(get("/api/v1/developer/webhooks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        // 3. Delete Webhook
        mockMvc.perform(delete("/api/v1/developer/webhooks/" + webhookId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
