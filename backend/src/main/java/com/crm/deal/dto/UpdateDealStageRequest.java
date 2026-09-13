package com.crm.deal.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDealStageRequest {

    private String stage;

    private String stageId;

    private String lossReason;

    private String winReason;

    private String notes;
}
