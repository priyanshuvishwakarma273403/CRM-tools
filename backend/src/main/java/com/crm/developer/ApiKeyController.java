package com.crm.developer;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/developer/api-keys")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    public ApiKeyController(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApiKey>>> listApiKeys() {
        return ResponseEntity.ok(ApiResponse.success(apiKeyService.listApiKeys(), "API keys retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createApiKey(@RequestBody Map<String, Object> req) {
        String name = (String) req.get("name");
        String scopes = (String) req.get("scopes");
        Integer rateLimit = req.get("rateLimitPerMinute") != null ? ((Number) req.get("rateLimitPerMinute")).intValue() : 120;
        Integer validDays = req.get("validDays") != null ? ((Number) req.get("validDays")).intValue() : 365;

        Map<String, Object> created = apiKeyService.generateApiKey(name, scopes, rateLimit, validDays);
        return ResponseEntity.ok(ApiResponse.success(created, "API key generated successfully. Save this secret now; it will not be shown again."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> revokeApiKey(@PathVariable String id) {
        apiKeyService.revokeApiKey(id);
        return ResponseEntity.ok(ApiResponse.success(null, "API key revoked successfully"));
    }
}
