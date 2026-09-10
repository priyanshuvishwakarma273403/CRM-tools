package com.crm.communication;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/communications")
public class CommunicationController {

    private final CommunicationService communicationService;

    public CommunicationController(CommunicationService communicationService) {
        this.communicationService = communicationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CommunicationLog>>> getCommunications(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(communicationService.getCommunications(pageable))));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<CommunicationLog>>> getCustomerTimeline(@PathVariable String customerId) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.getCustomerTimeline(customerId)));
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<ApiResponse<List<CommunicationLog>>> getLeadTimeline(@PathVariable String leadId) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.getLeadTimeline(leadId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommunicationLog>> logCommunication(@RequestBody CommunicationLog log) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.logCommunication(log), "Communication recorded"));
    }
}
