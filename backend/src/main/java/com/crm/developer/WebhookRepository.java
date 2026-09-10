package com.crm.developer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebhookRepository extends JpaRepository<Webhook, String> {
    List<Webhook> findAllByOrganizationId(String organizationId);
    List<Webhook> findAllByOrganizationIdAndIsActiveTrue(String organizationId);
    Optional<Webhook> findByIdAndOrganizationId(String id, String organizationId);
}
