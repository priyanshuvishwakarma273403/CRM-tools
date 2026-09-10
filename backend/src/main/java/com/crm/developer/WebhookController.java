package com.crm.developer;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/developer/webhooks")
public class WebhookController {

    private final WebhookService webhookService;

    public WebhookController(WebhookService webhookService) {
        this.webhookService = webhookService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Webhook>>> listWebhooks() {
        return ResponseEntity.ok(ApiResponse.success(webhookService.listWebhooks(), "Webhooks retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Webhook>> createWebhook(@RequestBody Map<String, Object> req) {
        String url = (String) req.get("url");
        List<String> events = (List<String>) req.get("events");

        Webhook webhook = webhookService.createWebhook(url, events);
        return ResponseEntity.ok(ApiResponse.success(webhook, "Webhook created successfully. Save your webhook secret."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWebhook(@PathVariable String id) {
        webhookService.deleteWebhook(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Webhook deleted successfully"));
    }

    @PostMapping("/{id}/test")
    public ResponseEntity<ApiResponse<WebhookDelivery>> testWebhook(@PathVariable String id) {
        WebhookDelivery delivery = webhookService.testWebhook(id);
        return ResponseEntity.ok(ApiResponse.success(delivery, "Test event dispatched"));
    }

    @GetMapping("/{id}/deliveries")
    public ResponseEntity<ApiResponse<PageResponse<WebhookDelivery>>> getDeliveries(@PathVariable String id, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(webhookService.getDeliveries(id, pageable)), "Delivery history retrieved"));
    }
}
