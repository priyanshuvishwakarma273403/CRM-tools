package com.crm.pipeline.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StageResponse {

    private String id;
    private String name;
    private String code;
    private Integer orderIndex;
    private Integer winProbability;
    private String colorCode;
    private Integer dealCount;
    private BigDecimal totalValue;
    private LocalDateTime createdAt;
}
