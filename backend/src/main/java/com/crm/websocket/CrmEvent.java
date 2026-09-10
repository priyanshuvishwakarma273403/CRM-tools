package com.crm.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrmEvent {
    private String eventType;
    private String organizationId;
    private Object data;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
