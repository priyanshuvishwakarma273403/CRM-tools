package com.crm.knowledge.dto;

import com.crm.knowledge.ArticleStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateArticleRequest {

    private String title;

    private String content;

    private String summary;

    private String category;

    private String tags;

    private ArticleStatus status;
}
