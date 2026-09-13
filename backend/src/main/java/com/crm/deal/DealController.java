package com.crm.deal;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.deal.dto.PipelineMetricsResponse;
import com.crm.deal.dto.RevenueForecastResponse;
import com.crm.deal.dto.UpdateDealStageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping("/pipeline")
    public ResponseEntity<ApiResponse<List<Deal>>> getPipeline() {
        return ResponseEntity.ok(ApiResponse.success(dealService.getAllDeals()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Deal>>> getDeals(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(dealService.getDeals(pageable))));
    }

    @GetMapping("/pipeline-metrics")
    public ResponseEntity<ApiResponse<PipelineMetricsResponse>> getPipelineMetrics(
            @RequestParam(required = false) String pipelineId) {
        return ResponseEntity.ok(ApiResponse.success(dealService.getPipelineMetrics(pipelineId), "Pipeline metrics calculated successfully"));
    }

    @GetMapping("/forecast")
    public ResponseEntity<ApiResponse<RevenueForecastResponse>> getRevenueForecast() {
        return ResponseEntity.ok(ApiResponse.success(dealService.getRevenueForecast(), "Revenue forecast generated successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Deal>> getDealById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(dealService.getDealById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Deal>> createDeal(@RequestBody Deal deal) {
        return ResponseEntity.ok(ApiResponse.success(dealService.createDeal(deal), "Deal created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Deal>> updateDeal(@PathVariable String id, @RequestBody Deal deal) {
        return ResponseEntity.ok(ApiResponse.success(dealService.updateDeal(id, deal), "Deal updated successfully"));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<ApiResponse<Deal>> updateStage(@PathVariable String id, @RequestBody Map<String, String> body) {
        UpdateDealStageRequest req = UpdateDealStageRequest.builder()
                .stage(body.get("stage"))
                .stageId(body.get("stageId"))
                .winReason(body.get("winReason"))
                .lossReason(body.get("lossReason"))
                .notes(body.get("notes"))
                .build();
        return ResponseEntity.ok(ApiResponse.success(dealService.updateStage(id, req), "Deal stage updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDeal(@PathVariable String id) {
        dealService.deleteDeal(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deal deleted successfully"));
    }
}
