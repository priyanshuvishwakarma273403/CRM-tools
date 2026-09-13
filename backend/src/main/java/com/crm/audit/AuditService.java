package com.crm.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service to record enterprise audit logs asynchronously.
 */
@Slf4j
@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AuditService(AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordLog(String organizationId,
                          String userId,
                          String userEmail,
                          String action,
                          String entityType,
                          String entityId,
                          Object details,
                          String ipAddress) {
        try {
            String detailsJson = null;
            if (details != null) {
                if (details instanceof String s) {
                    detailsJson = s;
                } else {
                    detailsJson = objectMapper.writeValueAsString(details);
                }
            }

            AuditLog logEntry = AuditLog.builder()
                    .organizationId(organizationId != null ? organizationId : "system")
                    .userId(userId)
                    .userEmail(userEmail)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .detailsJson(detailsJson)
                    .ipAddress(ipAddress)
                    .createdAt(LocalDateTime.now())
                    .build();

            auditLogRepository.save(logEntry);
        } catch (Exception e) {
            log.warn("Failed to record audit log for action: {}: {}", action, e.getMessage());
        }
    }
}
