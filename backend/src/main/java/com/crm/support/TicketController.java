package com.crm.support;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.support.dto.AddCommentRequest;
import com.crm.support.dto.CreateTicketRequest;
import com.crm.support.dto.CsatFeedbackRequest;
import com.crm.support.dto.UpdateTicketRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Ticket>>> getTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            Pageable pageable) {
        Page<Ticket> page = ticketService.getTickets(status, priority, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getTicket(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        Ticket created = ticketService.createTicket(request);
        return ResponseEntity.ok(ApiResponse.success(created, "Ticket created successfully with ID: " + created.getTicketNumber()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> updateTicket(@PathVariable String id, @Valid @RequestBody UpdateTicketRequest request) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.updateTicket(id, request), "Ticket updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Ticket>> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        TicketStatus status = TicketStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success(ticketService.updateStatus(id, status), "Ticket status updated to " + status));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<Ticket>> assignTicket(@PathVariable String id, @RequestBody Map<String, String> body) {
        String assigneeId = body.get("assigneeId");
        return ResponseEntity.ok(ApiResponse.success(ticketService.assignTicket(id, assigneeId), "Ticket assigned successfully"));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<TicketComment>>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getComments(id)));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<TicketComment>> addComment(@PathVariable String id,
                                                                 @Valid @RequestBody AddCommentRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth != null ? auth.getName() : "system";
        String userName = "Support Agent";

        TicketComment comment = ticketService.addComment(id, request, userId, userName);
        return ResponseEntity.ok(ApiResponse.success(comment, "Comment added successfully"));
    }

    @PostMapping("/{id}/csat")
    public ResponseEntity<ApiResponse<Ticket>> submitCsat(@PathVariable String id,
                                                          @Valid @RequestBody CsatFeedbackRequest request) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.submitCsat(id, request), "Customer satisfaction feedback submitted"));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getMetrics()));
    }
}
