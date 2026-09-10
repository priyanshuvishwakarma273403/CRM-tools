package com.crm.lead;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Lead>>> getLeads(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(leadService.getLeads(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> getLeadById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Lead>> createLead(@RequestBody Lead lead) {
        return ResponseEntity.ok(ApiResponse.success(leadService.createLead(lead), "Lead created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> updateLead(@PathVariable String id, @RequestBody Lead lead) {
        return ResponseEntity.ok(ApiResponse.success(leadService.updateLead(id, lead), "Lead updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Lead>> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        LeadStatus status = LeadStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.success(leadService.updateStatus(id, status), "Lead status updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable String id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Lead deleted successfully"));
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<ApiResponse<Lead>> convertLead(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.convertLead(id), "Lead converted successfully"));
    }
}
