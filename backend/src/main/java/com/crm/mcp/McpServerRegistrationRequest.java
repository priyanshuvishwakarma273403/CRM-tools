package com.crm.mcp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McpServerRegistrationRequest {
    private String name;
    private String serverUrl;
    private String transportType; // HTTP_SSE, STDIO
    private String authToken;
}
