package com.crm.developer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookDeliveryRepository extends JpaRepository<WebhookDelivery, String> {
    Page<WebhookDelivery> findAllByWebhookIdOrderByDeliveredAtDesc(String webhookId, Pageable pageable);
    List<WebhookDelivery> findTop20ByWebhookIdOrderByDeliveredAtDesc(String webhookId);
}
