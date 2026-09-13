package com.crm.event;

import com.crm.audit.AuditService;
import com.crm.timeline.TimelineService;
import com.crm.websocket.CrmEventPublisher;
import com.crm.workflow.WorkflowEngineService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Central Reactive Event Listener for the CRM OS.
 * Connects the Event Bus to the Workflow Engine, Audit Logger, Timeline Engine, WebSocket Broker, and External Webhooks.
 */
@Slf4j
@Component
public class DomainEventListener {

    private final WorkflowEngineService workflowEngineService;
    private final AuditService auditService;
    private final TimelineService timelineService;
    private final CrmEventPublisher crmEventPublisher;

    public DomainEventListener(WorkflowEngineService workflowEngineService,
                               AuditService auditService,
                               TimelineService timelineService,
                               CrmEventPublisher crmEventPublisher) {
        this.workflowEngineService = workflowEngineService;
        this.auditService = auditService;
        this.timelineService = timelineService;
        this.crmEventPublisher = crmEventPublisher;
    }

    @Async
    @EventListener
    public void onDomainEvent(CrmDomainEvent event) {
        if (event == null) {
            return;
        }

        log.debug("Received Domain Event: {} for organization: {}", event.getEventType(), event.getOrganizationId());

        try {
            // 1. Process automated workflows matching this event
            workflowEngineService.processDomainEvent(event);
        } catch (Exception e) {
            log.warn("Workflow engine error handling event {}: {}", event.getEventType(), e.getMessage());
        }

        try {
            // 2. Automatically record immutable audit trail
            auditService.recordLog(
                    event.getOrganizationId(),
                    event.getActorId(),
                    event.getActorEmail(),
                    event.getEventType(),
                    event.getEntityType(),
                    event.getEntityId(),
                    event.getPayload(),
                    null
            );
        } catch (Exception e) {
            log.warn("Audit service error recording event {}: {}", event.getEventType(), e.getMessage());
        }

        try {
            // 3. Automatically record polymorphic timeline event
            if (event.getEntityId() != null) {
                String title = formatEventTitle(event.getEventType(), event.getEntityType());
                timelineService.recordEvent(
                        event.getOrganizationId(),
                        event.getEntityType(),
                        event.getEntityId(),
                        event.getEventType(),
                        event.getActorId(),
                        event.getActorEmail(),
                        title,
                        null,
                        event.getPayload()
                );
            }
        } catch (Exception e) {
            log.warn("Timeline service error recording event {}: {}", event.getEventType(), e.getMessage());
        }

        try {
            // 4. Broadcast to real-time WebSockets & outbound Webhooks
            crmEventPublisher.publishEvent(event.getEventType(), event.getOrganizationId(), event.getPayload());
        } catch (Exception e) {
            log.warn("Real-time broadcast error for event {}: {}", event.getEventType(), e.getMessage());
        }
    }

    private String formatEventTitle(String eventType, String entityType) {
        if (eventType == null) return "System Activity";
        String formatted = eventType.replace("_", " ").toLowerCase();
        return Character.toUpperCase(formatted.charAt(0)) + formatted.substring(1);
    }
}
