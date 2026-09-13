package com.crm.pipeline;

import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.pipeline.dto.CreatePipelineRequest;
import com.crm.pipeline.dto.CreateStageRequest;
import com.crm.pipeline.dto.ReorderStagesRequest;
import com.crm.pipeline.dto.UpdatePipelineRequest;
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

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PipelineLifecycleTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PipelineRepository pipelineRepository;

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
                    .name("Pipeline Test Org")
                    .domain("pipelinetest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("sales-admin", "admin@pipelinetest.com", org.getId(), "ADMIN");
    }

    @Test
    void testGetDefaultPipeline() throws Exception {
        mockMvc.perform(get("/api/v1/pipelines/default")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").exists())
                .andExpect(jsonPath("$.data.stages", hasSize(greaterThanOrEqualTo(5))));
    }

    @Test
    void testCompletePipelineAndStagesLifecycle() throws Exception {
        // 1. Create a custom pipeline with initial stages
        CreatePipelineRequest createReq = CreatePipelineRequest.builder()
                .name("Partnership Deals Pipeline")
                .isDefault(false)
                .stages(List.of(
                        CreateStageRequest.builder().name("Outreach").code("OUTREACH").orderIndex(1).winProbability(15).colorCode("#3B82F6").build(),
                        CreateStageRequest.builder().name("Technical Review").code("TECH_REVIEW").orderIndex(2).winProbability(40).colorCode("#8B5CF6").build(),
                        CreateStageRequest.builder().name("Contracting").code("CONTRACTING").orderIndex(3).winProbability(80).colorCode("#10B981").build()
                ))
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/v1/pipelines")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Partnership Deals Pipeline"))
                .andExpect(jsonPath("$.data.stages", hasSize(3)))
                .andReturn();

        JsonNode createdJson = objectMapper.readTree(createResult.getResponse().getContentAsString());
        String pipelineId = createdJson.path("data").path("id").asText();
        String firstStageId = createdJson.path("data").path("stages").get(0).path("id").asText();
        String secondStageId = createdJson.path("data").path("stages").get(1).path("id").asText();
        String thirdStageId = createdJson.path("data").path("stages").get(2).path("id").asText();

        assertNotNull(pipelineId);

        // 2. Update pipeline details
        UpdatePipelineRequest updateReq = UpdatePipelineRequest.builder()
                .name("Strategic Partnerships Pipeline")
                .build();

        mockMvc.perform(put("/api/v1/pipelines/" + pipelineId)
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Strategic Partnerships Pipeline"));

        // 3. Add a new stage
        CreateStageRequest addStageReq = CreateStageRequest.builder()
                .name("Security Audit")
                .code("SEC_AUDIT")
                .orderIndex(4)
                .winProbability(60)
                .colorCode("#F59E0B")
                .build();

        MvcResult addStageResult = mockMvc.perform(post("/api/v1/pipelines/" + pipelineId + "/stages")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addStageReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Security Audit"))
                .andReturn();

        String addedStageId = objectMapper.readTree(addStageResult.getResponse().getContentAsString())
                .path("data").path("id").asText();

        // 4. Reorder stages
        ReorderStagesRequest reorderReq = ReorderStagesRequest.builder()
                .stageIds(List.of(thirdStageId, secondStageId, firstStageId, addedStageId))
                .build();

        mockMvc.perform(put("/api/v1/pipelines/" + pipelineId + "/stages/reorder")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(thirdStageId))
                .andExpect(jsonPath("$.data[0].orderIndex").value(1));

        // 5. Delete added stage
        mockMvc.perform(delete("/api/v1/pipelines/" + pipelineId + "/stages/" + addedStageId)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 6. Delete custom pipeline
        mockMvc.perform(delete("/api/v1/pipelines/" + pipelineId)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
