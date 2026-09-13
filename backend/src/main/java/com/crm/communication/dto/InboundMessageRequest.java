package com.crm.communication.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InboundMessageRequest {

    @NotBlank(message = "Channel is required (e.g. EMAIL, SMS, WHATSAPP)")
    private String channel;

    @NotBlank(message = "Sender is required (email or phone number)")
    private String sender;

    private String recipient;

    private String subject;

    @NotBlank(message = "Content is required")
    private String content;

    private String threadId;

    private String externalMessageId;

    private Map<String, Object> metadata;
}
