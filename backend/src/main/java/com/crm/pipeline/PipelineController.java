package com.crm.pipeline;

import com.crm.common.dto.ApiResponse;
import com.crm.pipeline.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pipelines")
public class PipelineController {

    private final PipelineService pipelineService;

    public PipelineController(PipelineService pipelineService) {
        this.pipelineService = pipelineService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PipelineResponse>>> getPipelines() {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.getPipelines()));
    }

    @GetMapping("/default")
    public ResponseEntity<ApiResponse<PipelineResponse>> getDefaultPipeline() {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.getDefaultPipeline()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PipelineResponse>> getPipelineById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.getPipelineById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PipelineResponse>> createPipeline(@Valid @RequestBody CreatePipelineRequest request) {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.createPipeline(request), "Pipeline created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PipelineResponse>> updatePipeline(@PathVariable String id, @RequestBody UpdatePipelineRequest request) {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.updatePipeline(id, request), "Pipeline updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePipeline(@PathVariable String id) {
        pipelineService.deletePipeline(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Pipeline deleted successfully"));
    }

    @PostMapping("/{id}/stages")
    public ResponseEntity<ApiResponse<StageResponse>> addStage(@PathVariable String id, @Valid @RequestBody CreateStageRequest request) {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.addStage(id, request), "Stage added successfully"));
    }

    @PutMapping("/{id}/stages/{stageId}")
    public ResponseEntity<ApiResponse<StageResponse>> updateStage(
            @PathVariable String id,
            @PathVariable String stageId,
            @RequestBody UpdateStageRequest request) {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.updateStage(id, stageId, request), "Stage updated successfully"));
    }

    @DeleteMapping("/{id}/stages/{stageId}")
    public ResponseEntity<ApiResponse<Void>> deleteStage(@PathVariable String id, @PathVariable String stageId) {
        pipelineService.deleteStage(id, stageId);
        return ResponseEntity.ok(ApiResponse.success(null, "Stage deleted successfully"));
    }

    @PutMapping("/{id}/stages/reorder")
    public ResponseEntity<ApiResponse<List<StageResponse>>> reorderStages(
            @PathVariable String id,
            @Valid @RequestBody ReorderStagesRequest request) {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.reorderStages(id, request.getStageIds()), "Stages reordered successfully"));
    }
}
