package com.crm.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class CrmEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;
    private final org.springframework.context.ApplicationEventPublisher applicationEventPublisher;
    private final org.springframework.beans.factory.ObjectProvider<com.crm.developer.WebhookService> webhookServiceProvider;

    public CrmEventPublisher(SimpMessagingTemplate messagingTemplate,
                             org.springframework.context.ApplicationEventPublisher applicationEventPublisher,
                             org.springframework.beans.factory.ObjectProvider<com.crm.developer.WebhookService> webhookServiceProvider) {
        this.messagingTemplate = messagingTemplate;
        this.applicationEventPublisher = applicationEventPublisher;
        this.webhookServiceProvider = webhookServiceProvider;
    }

    public void publishEvent(String eventType, String organizationId, Object data) {
        try {
            CrmEvent event = CrmEvent.builder()
                    .eventType(eventType)
                    .organizationId(organizationId)
                    .data(data)
                    .timestamp(LocalDateTime.now())
                    .build();

            // 1. Broadcast to in-process decoupled event listeners (Audit, Cache Invalidation, Workflows)
            if (applicationEventPublisher != null) {
                applicationEventPublisher.publishEvent(event);
            }

            // 2. Broadcast globally and to tenant-specific channel via WebSocket
            messagingTemplate.convertAndSend("/topic/events", event);
            if (organizationId != null) {
                messagingTemplate.convertAndSend("/topic/events/" + organizationId, event);
            }

            // 3. Dispatch to subscribed external webhooks
            com.crm.developer.WebhookService webhookService = webhookServiceProvider.getIfAvailable();
            if (webhookService != null && organizationId != null) {
                webhookService.dispatchEvent(organizationId, eventType, data);
            }

            log.info("Published real-time CRM event: {} for tenant: {}", eventType, organizationId);
        } catch (Exception e) {
            log.warn("Failed to publish event: {}", e.getMessage());
        }
    }
}
