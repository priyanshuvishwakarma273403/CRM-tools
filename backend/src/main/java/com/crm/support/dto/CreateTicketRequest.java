package com.crm.support.dto;

import com.crm.support.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {

    @NotBlank(message = "Ticket subject is required")
    private String subject;

    private String description;

    @Builder.Default
    private TicketPriority priority = TicketPriority.MEDIUM;

    private String category;

    private String customerId;

    private String contactId;

    private String assigneeId;
}
