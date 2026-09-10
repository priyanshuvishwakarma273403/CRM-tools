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
public class McpToolDto {
    private String name;
    private String description;
    private Map<String, Object> inputSchema;
    private boolean destructive;
    private boolean requireConfirmation;
    private String source; // "BUILTIN" or server name
}
