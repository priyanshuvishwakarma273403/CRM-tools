package com.crm.timeline;

import com.crm.security.TenantContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
public class TimelineService {

    private final TimelineEventRepository timelineEventRepository;
    private final ObjectMapper objectMapper;

    public TimelineService(TimelineEventRepository timelineEventRepository, ObjectMapper objectMapper) {
        this.timelineEventRepository = timelineEventRepository;
        this.objectMapper = objectMapper;
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordEvent(String orgId,
                            String entityType,
                            String entityId,
                            String eventType,
                            String actorId,
                            String actorName,
                            String title,
                            String description,
                            Object payload) {
        try {
            String payloadJson = null;
            if (payload != null) {
                if (payload instanceof String s) {
                    payloadJson = s;
                } else {
                    payloadJson = objectMapper.writeValueAsString(payload);
                }
            }

            TimelineEvent event = TimelineEvent.builder()
                    .organizationId(orgId)
                    .entityType(entityType != null ? entityType.toUpperCase() : "GENERIC")
                    .entityId(entityId)
                    .eventType(eventType)
                    .actorId(actorId)
                    .actorName(actorName != null ? actorName : "System")
                    .title(title)
                    .description(description)
                    .payloadJson(payloadJson)
                    .createdAt(LocalDateTime.now())
                    .build();

            timelineEventRepository.save(event);
        } catch (Exception e) {
            log.warn("Failed to record timeline event for {}:{}: {}", entityType, entityId, e.getMessage());
        }
    }

    public Page<TimelineEvent> getTimeline(String entityType, String entityId, Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return timelineEventRepository.findByOrganizationIdAndEntityTypeAndEntityIdOrderByCreatedAtDesc(
                orgId, entityType.toUpperCase(), entityId, pageable);
    }

    public Page<TimelineEvent> getOrganizationFeed(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return timelineEventRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId, pageable);
    }
}
