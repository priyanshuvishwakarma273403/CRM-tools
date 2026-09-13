package com.crm.search;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final GlobalSearchService globalSearchService;

    public SearchController(GlobalSearchService globalSearchService) {
        this.globalSearchService = globalSearchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> search(
            @RequestParam("q") String query,
            @RequestParam(value = "types", required = false, defaultValue = "ALL") String types,
            @RequestParam(value = "limit", required = false, defaultValue = "10") int limit) {

        Map<String, Object> results = globalSearchService.executeSearch(query, types, limit);
        return ResponseEntity.ok(ApiResponse.success(results, "Search completed"));
    }
}
