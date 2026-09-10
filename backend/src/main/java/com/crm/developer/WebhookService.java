package com.crm.developer;

import com.crm.security.TenantContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class WebhookService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

    private final WebhookRepository webhookRepository;
    private final WebhookDeliveryRepository webhookDeliveryRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public WebhookService(WebhookRepository webhookRepository,
                          WebhookDeliveryRepository webhookDeliveryRepository,
                          ObjectMapper objectMapper) {
        this.webhookRepository = webhookRepository;
        this.webhookDeliveryRepository = webhookDeliveryRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(4))
                .build();
    }

    @Transactional
    public Webhook createWebhook(String url, List<String> subscribedEvents) {
        String orgId = TenantContext.getCurrentTenant();

        // Generate secret
        StringBuilder sb = new StringBuilder("whsec_");
        for (int i = 0; i < 28; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        String secret = sb.toString();

        String eventsJson = "[\"*\"]";
        try {
            if (subscribedEvents != null && !subscribedEvents.isEmpty()) {
                eventsJson = objectMapper.writeValueAsString(subscribedEvents);
            }
        } catch (Exception ignored) {}

        Webhook webhook = Webhook.builder()
                .organizationId(orgId)
                .url(url)
                .secret(secret)
                .subscribedEventsJson(eventsJson)
                .isActive(true)
                .build();

        return webhookRepository.save(webhook);
    }

    public List<Webhook> listWebhooks() {
        String orgId = TenantContext.getCurrentTenant();
        return webhookRepository.findAllByOrganizationId(orgId);
    }

    @Transactional
    public void deleteWebhook(String id) {
        String orgId = TenantContext.getCurrentTenant();
        webhookRepository.findByIdAndOrganizationId(id, orgId).ifPresent(webhookRepository::delete);
    }

    public Page<WebhookDelivery> getDeliveries(String webhookId, Pageable pageable) {
        return webhookDeliveryRepository.findAllByWebhookIdOrderByDeliveredAtDesc(webhookId, pageable);
    }

    /**
     * Sends a test ping to verify endpoint reachability
     */
    public WebhookDelivery testWebhook(String webhookId) {
        String orgId = TenantContext.getCurrentTenant();
        Webhook webhook = webhookRepository.findByIdAndOrganizationId(webhookId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Webhook not found"));

        Map<String, Object> testPayload = Map.of(
                "event", "ping",
                "timestamp", LocalDateTime.now().toString(),
                "organization_id", orgId,
                "message", "Nexus CRM OS Webhook Verification Ping"
        );

        return deliver(webhook, "ping", testPayload);
    }

    /**
     * Dispatches event payload asynchronously to all subscribed active webhooks
     */
    public void dispatchEvent(String orgId, String eventType, Object data) {
        if (orgId == null) return;
        List<Webhook> activeWebhooks = webhookRepository.findAllByOrganizationIdAndIsActiveTrue(orgId);
        if (activeWebhooks.isEmpty()) return;

        Map<String, Object> payload = Map.of(
                "event", eventType,
                "timestamp", LocalDateTime.now().toString(),
                "organization_id", orgId,
                "data", data
        );

        for (Webhook wh : activeWebhooks) {
            CompletableFuture.runAsync(() -> deliver(wh, eventType, payload));
        }
    }

    private WebhookDelivery deliver(Webhook webhook, String eventType, Object payload) {
        String payloadJson = "";
        try {
            payloadJson = objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            payloadJson = "{}";
        }

        String signature = hmacSha256(payloadJson, webhook.getSecret());
        int statusCode = 0;
        String status = "FAILED";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(webhook.getUrl()))
                    .header("Content-Type", "application/json")
                    .header("X-CRM-Signature", "sha256=" + signature)
                    .header("X-CRM-Event", eventType)
                    .timeout(Duration.ofSeconds(5))
                    .POST(HttpRequest.BodyPublishers.ofString(payloadJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            statusCode = response.statusCode();
            status = (statusCode >= 200 && statusCode < 300) ? "SUCCESS" : "FAILED";

        } catch (Exception ex) {
            log.warn("Webhook delivery failed for url {}: {}", webhook.getUrl(), ex.getMessage());
            status = "FAILED";
        }

        WebhookDelivery delivery = WebhookDelivery.builder()
                .webhookId(webhook.getId())
                .eventType(eventType)
                .payloadJson(payloadJson)
                .statusCode(statusCode)
                .attempts(1)
                .status(status)
                .deliveredAt(LocalDateTime.now())
                .build();

        return webhookDeliveryRepository.save(delivery);
    }

    public static String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : rawHmac) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }
}
