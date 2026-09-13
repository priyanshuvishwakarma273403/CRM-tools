package com.crm.deal.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueForecastResponse {

    private BigDecimal totalProjectedRevenue;
    private BigDecimal totalWeightedPipeline;
    private ForecastPeriod currentMonth;
    private ForecastPeriod currentQuarter;
    private ForecastPeriod nextQuarter;
    private ForecastPeriod fullYear;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForecastPeriod {
        private String periodName;
        private BigDecimal closedWon;
        private BigDecimal commit;
        private BigDecimal bestCase;
        private BigDecimal pipeline;
        private BigDecimal weighted;
        private long dealCount;
    }
}
