package com.crm.support.dto;

import com.crm.support.TicketPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTicketRequest {

    private String subject;

    private String description;

    private TicketPriority priority;

    private String category;

    private String assigneeId;
}
