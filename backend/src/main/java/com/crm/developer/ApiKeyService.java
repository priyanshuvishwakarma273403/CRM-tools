package com.crm.developer;

import com.crm.security.TenantContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ApiKeyService {

    private static final String KEY_PREFIX = "crm_live_";
    private static final String CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ApiKeyRepository apiKeyRepository;
    private final com.crm.user.UserRepository userRepository;

    public ApiKeyService(ApiKeyRepository apiKeyRepository, com.crm.user.UserRepository userRepository) {
        this.apiKeyRepository = apiKeyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Map<String, Object> generateApiKey(String name, String scopes, Integer rateLimit, Integer validDays) {
        String orgId = TenantContext.getCurrentTenant();
        String userId = getCurrentUserId();
        String validUserId = null;
        if (userId != null && userRepository.existsById(userId)) {
            validUserId = userId;
        }

        // 1. Generate random 32-char token
        StringBuilder sb = new StringBuilder(32);
        for (int i = 0; i < 32; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        String randomSecret = sb.toString();
        String fullRawKey = KEY_PREFIX + randomSecret;
        String prefix = fullRawKey.substring(0, 8);
        String hash = sha256(fullRawKey);

        LocalDateTime expires = (validDays != null && validDays > 0)
                ? LocalDateTime.now().plusDays(validDays)
                : LocalDateTime.now().plusYears(1);

        ApiKey apiKey = ApiKey.builder()
                .organizationId(orgId)
                .userId(validUserId)
                .name(name != null && !name.isBlank() ? name : "API Key " + LocalDateTime.now().toLocalDate())
                .keyHash(hash)
                .keyPrefix(prefix)
                .scopes(scopes != null && !scopes.isBlank() ? scopes : "read:all")
                .rateLimitPerMinute(rateLimit != null && rateLimit > 0 ? rateLimit : 120)
                .expiresAt(expires)
                .isActive(true)
                .build();

        ApiKey saved = apiKeyRepository.save(apiKey);

        Map<String, Object> result = new HashMap<>();
        result.put("id", saved.getId());
        result.put("name", saved.getName());
        result.put("keyPrefix", saved.getKeyPrefix());
        result.put("rawKey", fullRawKey); // Exposed only once!
        result.put("scopes", saved.getScopes());
        result.put("rateLimitPerMinute", saved.getRateLimitPerMinute());
        result.put("expiresAt", saved.getExpiresAt());
        result.put("createdAt", saved.getCreatedAt());

        return result;
    }

    public List<ApiKey> listApiKeys() {
        String orgId = TenantContext.getCurrentTenant();
        return apiKeyRepository.findAllByOrganizationId(orgId);
    }

    @Transactional
    public void revokeApiKey(String id) {
        String orgId = TenantContext.getCurrentTenant();
        apiKeyRepository.findByIdAndOrganizationId(id, orgId).ifPresent(key -> {
            key.setIsActive(false);
            apiKeyRepository.save(key);
        });
    }

    @Transactional
    public Optional<ApiKey> validateApiKey(String rawKey) {
        if (rawKey == null || !rawKey.startsWith(KEY_PREFIX)) {
            return Optional.empty();
        }
        String hash = sha256(rawKey);
        Optional<ApiKey> keyOpt = apiKeyRepository.findByKeyHashAndIsActiveTrue(hash);
        if (keyOpt.isPresent()) {
            ApiKey key = keyOpt.get();
            if (key.getExpiresAt() != null && key.getExpiresAt().isBefore(LocalDateTime.now())) {
                return Optional.empty(); // Expired
            }
            key.setLastUsedAt(LocalDateTime.now());
            apiKeyRepository.save(key);
            return Optional.of(key);
        }
        return Optional.empty();
    }

    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException("SHA-256 digest failed", ex);
        }
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return null;
    }
}
