package com.crm.activity;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Activity>>> getActivities(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(activityService.getActivities(pageable))));
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<ApiResponse<List<Activity>>> getEntityActivities(@PathVariable String type, @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(activityService.getActivitiesForEntity(type, id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Activity>> logActivity(@RequestBody Activity activity) {
        return ResponseEntity.ok(ApiResponse.success(activityService.logActivity(activity), "Activity logged successfully"));
    }
}
