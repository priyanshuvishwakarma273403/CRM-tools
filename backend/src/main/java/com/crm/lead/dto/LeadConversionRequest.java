package com.crm.lead.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadConversionRequest {

    @Builder.Default
    private Boolean createCompany = true;

    private String companyName;

    @Builder.Default
    private Boolean createCustomer = true;

    @Builder.Default
    private Boolean createDeal = false;

    private String dealTitle;

    private BigDecimal dealValue;

    private String ownerId;
}
