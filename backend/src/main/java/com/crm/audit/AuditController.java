package com.crm.audit;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit-logs")
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    public AuditController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AuditLog>>> getAuditLogs(Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(auditLogRepository.findByOrganizationId(tenantId, pageable))));
    }
}
