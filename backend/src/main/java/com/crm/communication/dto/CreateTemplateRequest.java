package com.crm.communication.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTemplateRequest {

    @NotBlank(message = "Template name is required")
    private String name;

    @NotBlank(message = "Channel is required (e.g. EMAIL, SMS, WHATSAPP, IN_APP)")
    private String channel;

    private String subject;

    @NotBlank(message = "Body template is required")
    private String bodyTemplate;

    private List<String> variables;

    private String category;
}
