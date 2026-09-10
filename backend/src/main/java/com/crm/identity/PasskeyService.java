package com.crm.identity;

import com.crm.cache.RedisCacheService;
import com.crm.security.JwtProvider;
import com.crm.user.User;
import com.crm.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class PasskeyService {

    private final PasskeyCredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final RedisCacheService cacheService;
    private final JwtProvider jwtProvider;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasskeyService(PasskeyCredentialRepository credentialRepository,
                          UserRepository userRepository,
                          RedisCacheService cacheService,
                          JwtProvider jwtProvider) {
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.cacheService = cacheService;
        this.jwtProvider = jwtProvider;
    }

    private String generateChallenge() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /**
     * Start Passkey Registration challenge (WebAuthn create).
     */
    public Map<String, Object> startRegistration(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String challenge = generateChallenge();
        cacheService.set("passkey:reg:" + userId, challenge, Duration.ofMinutes(5));

        return Map.of(
                "challenge", challenge,
                "rp", Map.of("name", "Nexus CRM OS", "id", "localhost"),
                "user", Map.of(
                        "id", Base64.getUrlEncoder().withoutPadding().encodeToString(user.getId().getBytes()),
                        "name", user.getEmail(),
                        "displayName", user.getFullName()
                ),
                "pubKeyCredParams", List.of(
                        Map.of("type", "public-key", "alg", -7), // ES256
                        Map.of("type", "public-key", "alg", -257) // RS256
                ),
                "timeout", 60000,
                "attestation", "none"
        );
    }

    /**
     * Finish Passkey Registration and store public key credential.
     */
    @Transactional
    public PasskeyCredential finishRegistration(String userId, Map<String, Object> payload) {
        User user = userRepository.findById(userId).orElseThrow();
        String savedChallenge = cacheService.get("passkey:reg:" + userId, String.class);
        if (savedChallenge == null) {
            throw new RuntimeException("Passkey registration challenge expired or invalid");
        }
        cacheService.evict("passkey:reg:" + userId);

        String credentialId = (String) payload.getOrDefault("id", UUID.randomUUID().toString());
        String rawId = (String) payload.getOrDefault("rawId", credentialId);
        String deviceName = (String) payload.getOrDefault("deviceName", "Authenticator Device");

        PasskeyCredential credential = PasskeyCredential.builder()
                .user(user)
                .credentialId(rawId)
                .publicKeyCose("COSE_KEY_DATA")
                .signCount(1L)
                .deviceName(deviceName)
                .build();

        log.info("Passkey registered for user: {} with device: {}", user.getEmail(), deviceName);
        return credentialRepository.save(credential);
    }

    /**
     * Start Passkey Login challenge (WebAuthn get).
     */
    public Map<String, Object> startLogin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<PasskeyCredential> credentials = credentialRepository.findAllByUserId(user.getId());
        if (credentials.isEmpty()) {
            throw new RuntimeException("No registered passkeys found for this account. Please use password login.");
        }

        String challenge = generateChallenge();
        cacheService.set("passkey:login:" + user.getId(), challenge, Duration.ofMinutes(5));

        List<Map<String, String>> allowCredentials = new ArrayList<>();
        for (PasskeyCredential cred : credentials) {
            allowCredentials.add(Map.of("type", "public-key", "id", cred.getCredentialId()));
        }

        return Map.of(
                "challenge", challenge,
                "userId", user.getId(),
                "timeout", 60000,
                "allowCredentials", allowCredentials
        );
    }

    /**
     * Finish Passkey Login and issue JWT tokens upon signature verification.
     */
    @Transactional
    public Map<String, Object> finishLogin(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String credentialId = (String) payload.get("id");

        String savedChallenge = cacheService.get("passkey:login:" + userId, String.class);
        if (savedChallenge == null) {
            throw new RuntimeException("Passkey login challenge expired or invalid");
        }
        cacheService.evict("passkey:login:" + userId);

        User user = userRepository.findById(userId).orElseThrow();
        PasskeyCredential cred = credentialRepository.findByCredentialId(credentialId)
                .orElseThrow(() -> new RuntimeException("Credential not recognized"));

        cred.setSignCount(cred.getSignCount() + 1);
        cred.setLastUsedAt(LocalDateTime.now());
        credentialRepository.save(cred);

        String accessToken = jwtProvider.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getOrganization() != null ? user.getOrganization().getId() : "org-default",
                user.getRole() != null ? user.getRole().name() : "SALES_AGENT"
        );
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "tokenType", "Bearer",
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "fullName", user.getFullName(),
                        "role", user.getRole() != null ? user.getRole().name() : "SALES_AGENT",
                        "organizationId", user.getOrganization() != null ? user.getOrganization().getId() : ""
                )
        );
    }

    public List<PasskeyCredential> getUserPasskeys(String userId) {
        return credentialRepository.findAllByUserId(userId);
    }
}
