package com.crm.approval;

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

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ActionApprovalTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;

    @BeforeEach
    void setUp() {
        Organization org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Test Approval Org")
                    .domain("approval.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("admin-user", "admin@test.com", org.getId(), "ADMIN");
    }

    @Test
    void testActionApprovalLifecycle() throws Exception {
        // 1. Submit action approval
        ActionApproval req = ActionApproval.builder()
                .actionType("CRM_RECORD_MERGE")
                .title("Merge Duplicate Accounts: Acme Corp & Acme Technologies")
                .description("AI detected 98% similarity between customer records. Merging timeline and deals.")
                .payloadJson("{\"primaryId\":\"cust_1\",\"duplicateId\":\"cust_2\"}")
                .build();

        String createRes = mockMvc.perform(post("/api/v1/approvals")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(jsonPath("$.data.actionType").value("CRM_RECORD_MERGE"))
                .andReturn().getResponse().getContentAsString();

        Map respMap = objectMapper.readValue(createRes, Map.class);
        Map data = (Map) respMap.get("data");
        String approvalId = (String) data.get("id");

        // 2. List approvals
        mockMvc.perform(get("/api/v1/approvals?status=PENDING")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());

        // 3. Review approval (Approve)
        Map<String, String> reviewReq = Map.of(
                "decision", "APPROVED",
                "notes", "Verified duplicate records. Approved for automated merge."
        );

        mockMvc.perform(post("/api/v1/approvals/" + approvalId + "/review")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("APPROVED"));
    }
}
