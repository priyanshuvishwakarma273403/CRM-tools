package com.crm.identity;

import com.crm.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "passkey_credentials")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasskeyCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "credential_id", nullable = false, unique = true, length = 500)
    private String credentialId;

    @Column(name = "public_key_cose", nullable = false, columnDefinition = "TEXT")
    private String publicKeyCose;

    @Column(name = "sign_count")
    @Builder.Default
    private Long signCount = 0L;

    private String aaguid;

    @Column(name = "device_name")
    private String deviceName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (lastUsedAt == null) lastUsedAt = LocalDateTime.now();
    }
}
