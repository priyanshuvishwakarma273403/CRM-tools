package com.crm.mcp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McpExecuteRequest {
    private String tool;
    private Map<String, Object> parameters;
    private Boolean confirmed;
    private String confirmationToken;
}
