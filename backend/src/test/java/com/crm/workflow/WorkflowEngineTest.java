package com.crm.workflow;

import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import com.crm.task.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkflowEngineTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private WorkflowRuleRepository workflowRuleRepository;

    @Autowired
    private WorkflowExecutionRepository workflowExecutionRepository;

    @Autowired
    private TaskRepository taskRepository;

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
                    .name("Test Workflow Org")
                    .domain("workflowtest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("workflow-admin", "admin@workflowtest.com", org.getId(), "ADMIN");
    }

    @Test
    void testWorkflowRuleCreationAndExecutionLifecycle() throws Exception {
        // 1. Create Workflow Rule
        WorkflowRule rule = WorkflowRule.builder()
                .organizationId(org.getId())
                .name("High Value Lead Follow-up")
                .description("Creates high priority task when lead score exceeds 75")
                .triggerType("LEAD_CREATED")
                .conditionJson("{\"field\": \"score\", \"operator\": \"GREATER_THAN\", \"value\": 75}")
                .actionType("CREATE_TASK")
                .actionConfigJson("{\"title\": \"Priority VIP Lead Follow-up\", \"priority\": \"HIGH\", \"dueInDays\": 1}")
                .isActive(true)
                .build();

        String ruleResponse = mockMvc.perform(post("/api/v1/workflows")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rule)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNotEmpty())
                .andExpect(jsonPath("$.data.name").value("High Value Lead Follow-up"))
                .andReturn().getResponse().getContentAsString();

        String ruleId = objectMapper.readTree(ruleResponse).path("data").path("id").asText();

        // 2. Trigger rule manually with matching condition (score = 90) -> Expect SUCCESS
        mockMvc.perform(post("/api/v1/workflows/" + ruleId + "/execute")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("score", 90, "leadName", "VIP Enterprise"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCESS"))
                .andExpect(jsonPath("$.data.executionLog").isNotEmpty());

        // 3. Trigger rule manually with unmet condition (score = 50) -> Expect CONDITION_UNMET
        mockMvc.perform(post("/api/v1/workflows/" + ruleId + "/execute")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("score", 50, "leadName", "Low Priority"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CONDITION_UNMET"));

        // 4. Query workflow executions list
        mockMvc.perform(get("/api/v1/workflows/executions")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", notNullValue()))
                .andExpect(jsonPath("$.data.totalElements", greaterThanOrEqualTo(2)));
    }
}
