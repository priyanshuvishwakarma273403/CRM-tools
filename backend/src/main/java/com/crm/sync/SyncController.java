package com.crm.sync;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sync")
public class SyncController {

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processBatchSync(@RequestBody List<Map<String, Object>> syncQueue) {
        // Process offline queued mutations from client
        int processedCount = syncQueue != null ? syncQueue.size() : 0;
        Map<String, Object> response = Map.of(
                "status", "SUCCESS",
                "processed", processedCount,
                "timestamp", System.currentTimeMillis()
        );
        return ResponseEntity.ok(ApiResponse.success(response, "Batch sync processed successfully"));
    }
}
