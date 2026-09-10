package com.crm.mcp;

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

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class McpControllerTest {

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
                    .name("Test Org")
                    .domain("test.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        testOrgId = org.getId();
        TenantContext.setCurrentTenant(testOrgId);
    }

    @Test
    @WithMockUser(username = "admin-user", roles = {"ADMIN"})
    void testListTools() throws Exception {
        mockMvc.perform(get("/api/v1/mcp/tools")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[?(@.name == 'crm.search_customer')]").exists())
                .andExpect(jsonPath("$.data[?(@.name == 'crm.get_customer_360')]").exists())
                .andExpect(jsonPath("$.data[?(@.name == 'crm.get_sales_report')]").exists());
    }

    @Test
    @WithMockUser(username = "admin-user", roles = {"ADMIN"})
    void testExecuteSalesReportTool() throws Exception {
        McpExecuteRequest req = McpExecuteRequest.builder()
                .tool("crm.get_sales_report")
                .parameters(Map.of())
                .build();

        mockMvc.perform(post("/api/v1/mcp/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.tool").value("crm.get_sales_report"))
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));
    }
}
