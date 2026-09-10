package com.crm.identity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasskeyCredentialRepository extends JpaRepository<PasskeyCredential, String> {
    List<PasskeyCredential> findAllByUserId(String userId);
    Optional<PasskeyCredential> findByCredentialId(String credentialId);
}
