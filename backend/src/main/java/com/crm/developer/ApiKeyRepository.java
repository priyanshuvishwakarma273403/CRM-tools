package com.crm.developer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, String> {
    List<ApiKey> findAllByOrganizationId(String organizationId);
    Optional<ApiKey> findByIdAndOrganizationId(String id, String organizationId);
    Optional<ApiKey> findByKeyHashAndIsActiveTrue(String keyHash);
}
