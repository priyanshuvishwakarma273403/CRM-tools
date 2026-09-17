package com.crm.knowledge.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagSourceItem {

    private String articleId;
    private String title;
    private String category;
    private String chunk;
    private Double similarityScore;
}
