package com.crm.lead;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.lead.dto.LeadConversionRequest;
import com.crm.lead.dto.LeadConversionResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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
        Page<Lead> leads = leadService.getLeads(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(leads)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> getLead(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Lead>> createLead(@Valid @RequestBody Lead lead) {
        return ResponseEntity.ok(ApiResponse.success(leadService.createLead(lead), "Lead created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> updateLead(@PathVariable String id, @Valid @RequestBody Lead lead) {
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
    public ResponseEntity<ApiResponse<Object>> convertLead(
            @PathVariable String id,
            @RequestBody(required = false) LeadConversionRequest request) {
        if (request != null) {
            LeadConversionResponse response = leadService.convertLead(id, request);
            return ResponseEntity.ok(ApiResponse.success(response, "Lead converted successfully"));
        }
        Lead lead = leadService.convertLead(id);
        return ResponseEntity.ok(ApiResponse.success(lead, "Lead converted successfully"));
    }
}
