package com.crm.knowledge.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCountResponse {

    private String category;
    private long count;
}
