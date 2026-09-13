package com.crm.communication.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTemplateRequest {

    private String name;

    private String channel;

    private String subject;

    private String bodyTemplate;

    private List<String> variables;

    private String category;

    private Boolean isActive;
}
