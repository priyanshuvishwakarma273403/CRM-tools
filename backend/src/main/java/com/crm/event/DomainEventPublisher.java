package com.crm.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Publishes strongly typed domain events across the Spring application context.
 */
@Slf4j
@Component
public class DomainEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public DomainEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public void publish(CrmDomainEvent event) {
        if (event == null) {
            return;
        }
        log.debug("Publishing CRM Domain Event: {} for organization: {}", event.getEventType(), event.getOrganizationId());
        applicationEventPublisher.publishEvent(event);
    }

    public void publish(String eventType, String organizationId, String entityType, String entityId, Map<String, Object> payload) {
        CrmDomainEvent event = CrmDomainEvent.of(eventType, organizationId, entityType, entityId, payload);
        publish(event);
    }
}
