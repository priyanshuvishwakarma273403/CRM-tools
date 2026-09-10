package com.crm.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CalendarRepository extends JpaRepository<CalendarEvent, String> {
    List<CalendarEvent> findByOrganizationId(String organizationId);
    Optional<CalendarEvent> findByIdAndOrganizationId(String id, String organizationId);
    List<CalendarEvent> findByOrganizationIdAndStartTimeBetween(String organizationId, LocalDateTime start, LocalDateTime end);
}
