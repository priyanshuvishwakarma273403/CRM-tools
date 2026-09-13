package com.crm.timeline;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/timeline")
public class TimelineController {

    private final TimelineService timelineService;

    public TimelineController(TimelineService timelineService) {
        this.timelineService = timelineService;
    }

    @GetMapping("/{entityType}/{entityId}")
    public ResponseEntity<ApiResponse<PageResponse<TimelineEvent>>> getTimeline(
            @PathVariable String entityType,
            @PathVariable String entityId,
            Pageable pageable) {
        Page<TimelineEvent> page = timelineService.getTimeline(entityType, entityId, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<PageResponse<TimelineEvent>>> getFeed(Pageable pageable) {
        Page<TimelineEvent> page = timelineService.getOrganizationFeed(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }
}
