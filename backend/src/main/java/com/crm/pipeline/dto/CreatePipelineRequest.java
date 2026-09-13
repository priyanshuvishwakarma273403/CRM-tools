package com.crm.pipeline.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePipelineRequest {

    @NotBlank(message = "Pipeline name is required")
    private String name;

    private Boolean isDefault;

    private List<CreateStageRequest> stages;
}
