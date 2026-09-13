package com.crm.pipeline.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStageRequest {

    private String name;

    private String code;

    private Integer orderIndex;

    private Integer winProbability;

    private String colorCode;
}
