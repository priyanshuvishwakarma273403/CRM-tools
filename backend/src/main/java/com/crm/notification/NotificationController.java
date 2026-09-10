package com.crm.notification;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Notification>>> getNotifications(Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        String userId = SecurityContextHolder.getContext().getAuthentication() != null ?
                SecurityContextHolder.getContext().getAuthentication().getName() : "user-1";

        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(notificationRepository.findByOrgAndUser(tenantId, userId, pageable))));
    }
}
