package com.crm.pipeline.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PipelineResponse {

    private String id;
    private String organizationId;
    private String name;
    private Boolean isDefault;
    private List<StageResponse> stages;
    private Integer totalDeals;
    private BigDecimal totalValue;
    private LocalDateTime createdAt;
}
