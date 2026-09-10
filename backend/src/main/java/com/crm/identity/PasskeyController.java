package com.crm.identity;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/passkey")
public class PasskeyController {

    private final PasskeyService passkeyService;

    public PasskeyController(PasskeyService passkeyService) {
        this.passkeyService = passkeyService;
    }

    @PostMapping("/register/start")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startRegistration(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(passkeyService.startRegistration(userId)));
    }

    @PostMapping("/register/finish")
    public ResponseEntity<ApiResponse<PasskeyCredential>> finishRegistration(@RequestBody Map<String, Object> payload,
                                                                             Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(passkeyService.finishRegistration(userId, payload), "Passkey registered successfully"));
    }

    @PostMapping("/login/start")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startLogin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        return ResponseEntity.ok(ApiResponse.success(passkeyService.startLogin(email)));
    }

    @PostMapping("/login/finish")
    public ResponseEntity<ApiResponse<Map<String, Object>>> finishLogin(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(ApiResponse.success(passkeyService.finishLogin(payload), "Passkey authentication successful"));
    }

    @GetMapping("/credentials")
    public ResponseEntity<ApiResponse<List<PasskeyCredential>>> getCredentials(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(passkeyService.getUserPasskeys(userId)));
    }
}
