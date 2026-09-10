package com.crm.calendar;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CalendarEvent>>> getEvents() {
        return ResponseEntity.ok(ApiResponse.success(calendarService.getEvents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CalendarEvent>> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(calendarService.getEventById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CalendarEvent>> createEvent(@RequestBody CalendarEvent event) {
        return ResponseEntity.ok(ApiResponse.success(calendarService.createEvent(event), "Calendar event scheduled"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CalendarEvent>> updateEvent(@PathVariable String id, @RequestBody CalendarEvent event) {
        return ResponseEntity.ok(ApiResponse.success(calendarService.updateEvent(id, event), "Calendar event updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable String id) {
        calendarService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Calendar event deleted"));
    }
}
