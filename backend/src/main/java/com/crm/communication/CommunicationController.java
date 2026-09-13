package com.crm.communication;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.communication.dto.*;
import jakarta.validation.Valid;
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

    @GetMapping("/deal/{dealId}")
    public ResponseEntity<ApiResponse<List<CommunicationLog>>> getDealTimeline(@PathVariable String dealId) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.getDealTimeline(dealId)));
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<ApiResponse<List<CommunicationLog>>> getTicketTimeline(@PathVariable String ticketId) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.getTicketTimeline(ticketId)));
    }

    @GetMapping("/thread/{threadId}")
    public ResponseEntity<ApiResponse<List<CommunicationLog>>> getThread(@PathVariable String threadId) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.getThread(threadId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommunicationLog>> logCommunication(@RequestBody CommunicationLog log) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.logCommunication(log), "Communication recorded"));
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<CommunicationLog>> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.sendMessage(request), "Message sent successfully"));
    }

    @PostMapping("/inbound")
    public ResponseEntity<ApiResponse<CommunicationLog>> receiveInboundMessage(@Valid @RequestBody InboundMessageRequest request) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.receiveInboundMessage(request), "Inbound message processed"));
    }

    // --- Template Endpoints ---

    @GetMapping("/templates")
    public ResponseEntity<ApiResponse<List<CommunicationTemplate>>> getTemplates(
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.getTemplates(channel, category)));
    }

    @GetMapping("/templates/{id}")
    public ResponseEntity<ApiResponse<CommunicationTemplate>> getTemplateById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.getTemplateById(id)));
    }

    @PostMapping("/templates")
    public ResponseEntity<ApiResponse<CommunicationTemplate>> createTemplate(@Valid @RequestBody CreateTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.createTemplate(request), "Template created successfully"));
    }

    @PutMapping("/templates/{id}")
    public ResponseEntity<ApiResponse<CommunicationTemplate>> updateTemplate(
            @PathVariable String id,
            @RequestBody UpdateTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.updateTemplate(id, request), "Template updated successfully"));
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable String id) {
        communicationService.deleteTemplate(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Template deleted successfully"));
    }

    @PostMapping("/templates/{id}/render")
    public ResponseEntity<ApiResponse<RenderedTemplateResponse>> renderTemplate(
            @PathVariable String id,
            @RequestBody RenderTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(communicationService.renderTemplate(id, request), "Template rendered successfully"));
    }
}
