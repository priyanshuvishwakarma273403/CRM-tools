package com.crm.knowledge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagSearchRequest {

    @NotBlank(message = "Search query is required")
    private String query;

    private String category;

    @Builder.Default
    private Integer limit = 5;
}
