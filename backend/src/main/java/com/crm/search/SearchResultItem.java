package com.crm.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultItem {
    private String id;
    private String type; // LEAD, DEAL, CUSTOMER, TICKET, CONTACT, COMPANY
    private String title;
    private String subtitle;
    private String status;
    private String url;
}
