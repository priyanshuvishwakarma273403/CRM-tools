package com.crm.identity;

import com.crm.cache.RedisCacheService;
import com.crm.user.User;
import com.crm.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Slf4j
@Service
public class SessionService {

    private final UserSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final RedisCacheService cacheService;

    public SessionService(UserSessionRepository sessionRepository,
                          UserRepository userRepository,
                          RedisCacheService cacheService) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.cacheService = cacheService;
    }

    public static String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return String.valueOf(token.hashCode());
        }
    }

    @Transactional
    public UserSession createSession(String userId, String token, String ip, String userAgent, String deviceType, String os) {
        User user = userRepository.findById(userId).orElseThrow();
        String hash = hashToken(token);

        UserSession session = UserSession.builder()
                .user(user)
                .tokenHash(hash)
                .ipAddress(ip)
                .userAgent(userAgent)
                .deviceType(deviceType != null ? deviceType : detectDevice(userAgent))
                .os(os != null ? os : detectOs(userAgent))
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        return sessionRepository.save(session);
    }

    public List<UserSession> getActiveSessions(String userId) {
        return sessionRepository.findAllByUserIdAndIsRevokedFalseOrderByLastActiveAtDesc(userId);
    }

    @Transactional
    public void revokeSession(String sessionId, String userId) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            if (session.getUser().getId().equals(userId)) {
                session.setIsRevoked(true);
                sessionRepository.save(session);

                // Add to Redis revocation blacklist for 7 days
                cacheService.set("revoked:token:" + session.getTokenHash(), "REVOKED", Duration.ofDays(7));
                log.info("Session {} revoked for user {}", sessionId, userId);
            }
        });
    }

    public boolean isTokenRevoked(String token) {
        String hash = hashToken(token);
        String cached = cacheService.get("revoked:token:" + hash, String.class);
        if ("REVOKED".equals(cached)) {
            return true;
        }
        return sessionRepository.findByTokenHash(hash)
                .map(UserSession::getIsRevoked)
                .orElse(false);
    }

    private String detectDevice(String userAgent) {
        if (userAgent == null) return "DESKTOP";
        String ua = userAgent.toLowerCase();
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) return "MOBILE";
        if (ua.contains("tauri")) return "DESKTOP_APP";
        return "WEB";
    }

    private String detectOs(String userAgent) {
        if (userAgent == null) return "Windows";
        String ua = userAgent.toLowerCase();
        if (ua.contains("windows")) return "Windows";
        if (ua.contains("mac os") || ua.contains("macintosh")) return "macOS";
        if (ua.contains("android")) return "Android";
        if (ua.contains("iphone") || ua.contains("ios")) return "iOS";
        if (ua.contains("linux")) return "Linux";
        return "Unknown OS";
    }
}
