package com.crm.knowledge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagAskRequest {

    @NotBlank(message = "Question is required")
    private String question;

    private String category;
}
