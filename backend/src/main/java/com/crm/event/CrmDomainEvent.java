package com.crm.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Enterprise Base Domain Event for the CRM Operating System.
 * Decouples domain actions from listeners, workflow triggers, and UI channels.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CrmDomainEvent {

    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    private String eventType;

    private String organizationId;

    private String actorId;

    private String actorEmail;

    private String entityType;

    private String entityId;

    @Builder.Default
    private LocalDateTime occurredAt = LocalDateTime.now();

    @Builder.Default
    private Map<String, Object> payload = new HashMap<>();

    public static CrmDomainEvent of(String eventType, String organizationId, String entityType, String entityId, Map<String, Object> payload) {
        return CrmDomainEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(eventType)
                .organizationId(organizationId)
                .entityType(entityType)
                .entityId(entityId)
                .occurredAt(LocalDateTime.now())
                .payload(payload != null ? payload : new HashMap<>())
                .build();
    }
}
