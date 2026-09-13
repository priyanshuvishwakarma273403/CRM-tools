package com.crm.deal.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PipelineMetricsResponse {

    private String pipelineId;
    private String pipelineName;
    private long totalDeals;
    private long openDeals;
    private long wonDeals;
    private long lostDeals;
    private BigDecimal totalPipelineValue;
    private BigDecimal weightedPipelineValue;
    private Double winRate;
    private BigDecimal averageDealSize;
    private Double averageSalesCycleDays;
    private List<StageMetric> stages;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StageMetric {
        private String stageId;
        private String stageName;
        private String stageCode;
        private Integer orderIndex;
        private Integer winProbability;
        private String colorCode;
        private long dealCount;
        private BigDecimal totalValue;
        private BigDecimal weightedValue;
        private Double averageAgingDays;
    }
}
