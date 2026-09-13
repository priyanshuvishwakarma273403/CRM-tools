package com.crm.pipeline.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReorderStagesRequest {

    @NotEmpty(message = "Stage IDs list cannot be empty")
    private List<String> stageIds;
}
