package com.crm.lead.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadConversionResponse {

    private String leadId;

    private String companyId;

    private String companyName;

    private String contactId;

    private String contactName;

    private String customerId;

    private String customerName;

    private String dealId;

    private String dealTitle;

    private LocalDateTime convertedAt;

    private String message;
}
