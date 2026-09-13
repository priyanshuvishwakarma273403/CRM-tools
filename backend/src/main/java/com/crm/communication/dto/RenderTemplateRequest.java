package com.crm.communication.dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RenderTemplateRequest {

    private Map<String, Object> variables;
}
