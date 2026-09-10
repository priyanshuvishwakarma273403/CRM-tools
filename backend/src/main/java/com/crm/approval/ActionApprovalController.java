package com.crm.approval;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/approvals")
public class ActionApprovalController {

    private final ActionApprovalService approvalService;

    public ActionApprovalController(ActionApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ActionApproval>>> listApprovals(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.from(approvalService.listApprovals(status, pageable)),
                "Approvals retrieved"
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ActionApproval>> submitRequest(@RequestBody ActionApproval approval) {
        ActionApproval created = approvalService.submitRequest(approval);
        return ResponseEntity.ok(ApiResponse.success(created, "Approval request submitted to inbox"));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<ActionApproval>> reviewRequest(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String decision = payload.getOrDefault("decision", "APPROVED");
        String notes = payload.get("notes");
        ActionApproval reviewed = approvalService.reviewRequest(id, decision, notes);
        return ResponseEntity.ok(ApiResponse.success(reviewed, "Approval decision recorded: " + reviewed.getStatus()));
    }
}
