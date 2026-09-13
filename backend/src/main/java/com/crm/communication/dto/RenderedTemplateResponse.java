package com.crm.communication.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RenderedTemplateResponse {

    private String templateId;
    private String templateName;
    private String channel;
    private String renderedSubject;
    private String renderedBody;
}
