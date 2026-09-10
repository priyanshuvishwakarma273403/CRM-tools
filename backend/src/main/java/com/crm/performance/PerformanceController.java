package com.crm.performance;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/performance")
public class PerformanceController {

    private final PerformanceServiceClient performanceServiceClient;

    public PerformanceController(PerformanceServiceClient performanceServiceClient) {
        this.performanceServiceClient = performanceServiceClient;
    }

    @PostMapping("/dedup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> findDuplicates(@RequestBody Map<String, Object> query) {
        Map<String, Object> result = performanceServiceClient.findDuplicates(query);
        return ResponseEntity.ok(ApiResponse.success(result, "Deduplication analysis completed"));
    }

    @PostMapping("/monte-carlo-forecast")
    public ResponseEntity<ApiResponse<Map<String, Object>>> simulateForecast(@RequestBody Map<String, Object> query) {
        Map<String, Object> result = performanceServiceClient.simulateMonteCarlo(query);
        return ResponseEntity.ok(ApiResponse.success(result, "Monte Carlo pipeline simulation completed"));
    }
}
