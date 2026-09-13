package com.crm.communication.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotBlank(message = "Channel is required (e.g. EMAIL, SMS, WHATSAPP, CALL)")
    private String channel;

    private String recipient;

    private String sender;

    private String subject;

    private String content;

    private String templateId;

    private Map<String, Object> templateVariables;

    private String customerId;

    private String leadId;

    private String dealId;

    private String ticketId;

    private String threadId;

    private String parentId;
}
