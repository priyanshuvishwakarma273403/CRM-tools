package com.crm.identity;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserSession>>> getActiveSessions(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(sessionService.getActiveSessions(userId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> revokeSession(@PathVariable String id, Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        sessionService.revokeSession(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Session revoked successfully"));
    }
}
