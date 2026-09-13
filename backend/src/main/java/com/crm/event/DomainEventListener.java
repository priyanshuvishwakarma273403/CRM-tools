package com.crm.event;

import com.crm.audit.AuditService;
import com.crm.websocket.CrmEventPublisher;
import com.crm.workflow.WorkflowEngineService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Central Reactive Event Listener for the CRM OS.
 * Connects the Event Bus to the Workflow Engine, Audit Logger, WebSocket Broker, and External Webhooks.
 */
@Slf4j
@Component
public class DomainEventListener {

    private final WorkflowEngineService workflowEngineService;
    private final AuditService auditService;
    private final CrmEventPublisher crmEventPublisher;

    public DomainEventListener(WorkflowEngineService workflowEngineService,
                               AuditService auditService,
                               CrmEventPublisher crmEventPublisher) {
        this.workflowEngineService = workflowEngineService;
        this.auditService = auditService;
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
            // 3. Broadcast to real-time WebSockets & outbound Webhooks
            crmEventPublisher.publishEvent(event.getEventType(), event.getOrganizationId(), event.getPayload());
        } catch (Exception e) {
            log.warn("Real-time broadcast error for event {}: {}", event.getEventType(), e.getMessage());
        }
    }
}
