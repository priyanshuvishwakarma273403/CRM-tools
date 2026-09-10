package com.crm.mcp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McpExecuteResponse {
    private String tool;
    private String status; // "SUCCESS", "CONFIRMATION_REQUIRED", "ERROR", "PERMISSION_DENIED"
    private Object result;
    private String message;
    private Long executionTimeMs;
    private Boolean requiresConfirmation;
    private String confirmationPrompt;
}
