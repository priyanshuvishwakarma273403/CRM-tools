package com.crm.knowledge.dto;

import com.crm.knowledge.ArticleStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateArticleRequest {

    @NotBlank(message = "Article title is required")
    private String title;

    @NotBlank(message = "Article content is required")
    private String content;

    private String summary;

    private String category;

    private String tags;

    private ArticleStatus status;
}
