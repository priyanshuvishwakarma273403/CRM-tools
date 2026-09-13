package com.crm.pipeline.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStageRequest {

    @NotBlank(message = "Stage name is required")
    private String name;

    @NotBlank(message = "Stage code is required")
    private String code;

    private Integer orderIndex;

    private Integer winProbability;

    private String colorCode;
}
