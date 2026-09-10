package com.crm.identity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    List<UserSession> findAllByUserIdAndIsRevokedFalseOrderByLastActiveAtDesc(String userId);
    Optional<UserSession> findByTokenHash(String tokenHash);
}
