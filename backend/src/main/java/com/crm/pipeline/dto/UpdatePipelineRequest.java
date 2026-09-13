package com.crm.pipeline.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePipelineRequest {

    private String name;

    private Boolean isDefault;
}
