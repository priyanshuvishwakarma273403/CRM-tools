package com.crm.knowledge.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagAskResponse {

    private String question;
    private String answer;
    private Double confidenceScore;
    private List<RagSourceItem> sources;
}
