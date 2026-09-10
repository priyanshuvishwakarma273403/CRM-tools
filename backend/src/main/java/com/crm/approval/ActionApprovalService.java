package com.crm.approval;

import com.crm.security.TenantContext;
import com.crm.websocket.CrmEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
public class ActionApprovalService {

    private final ActionApprovalRepository actionApprovalRepository;
    private final CrmEventPublisher eventPublisher;

    public ActionApprovalService(ActionApprovalRepository actionApprovalRepository,
                                 CrmEventPublisher eventPublisher) {
        this.actionApprovalRepository = actionApprovalRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public ActionApproval submitRequest(ActionApproval approval) {
        String orgId = TenantContext.getCurrentTenant();
        if (orgId == null) orgId = "org-demo-1";
        String userId = getCurrentUserId();

        approval.setOrganizationId(orgId);
        if (approval.getRequesterId() == null) {
            approval.setRequesterId(userId);
        }
        approval.setStatus("PENDING");

        ActionApproval saved = actionApprovalRepository.save(approval);
        eventPublisher.publishEvent("ai.action.recommended", orgId, saved);
        return saved;
    }

    public Page<ActionApproval> listApprovals(String status, Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        if (orgId == null) orgId = "org-demo-1";
        if (status != null && !status.isBlank()) {
            return actionApprovalRepository.findAllByOrganizationIdAndStatusOrderByCreatedAtDesc(orgId, status.toUpperCase(), pageable);
        }
        return actionApprovalRepository.findAllByOrganizationIdOrderByCreatedAtDesc(orgId, pageable);
    }

    @Transactional
    public ActionApproval reviewRequest(String id, String decision, String notes) {
        String orgId = TenantContext.getCurrentTenant();
        if (orgId == null) orgId = "org-demo-1";
        String reviewerId = getCurrentUserId();

        ActionApproval approval = actionApprovalRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Approval request not found"));

        if (!"PENDING".equalsIgnoreCase(approval.getStatus())) {
            throw new IllegalStateException("Approval request is already " + approval.getStatus());
        }

        String normalizedDecision = "APPROVE".equalsIgnoreCase(decision) || "APPROVED".equalsIgnoreCase(decision)
                ? "APPROVED"
                : "REJECTED";

        approval.setStatus(normalizedDecision);
        approval.setReviewerId(reviewerId);
        approval.setReviewerNotes(notes);
        approval.setReviewedAt(LocalDateTime.now());

        ActionApproval updated = actionApprovalRepository.save(approval);
        eventPublisher.publishEvent("ai.approval.decision", orgId, updated);
        log.info("Action approval {} evaluated as {} by user {}", id, normalizedDecision, reviewerId);

        return updated;
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "system";
    }
}
