package com.crm.calendar;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final OrganizationRepository organizationRepository;

    public CalendarService(CalendarRepository calendarRepository, OrganizationRepository organizationRepository) {
        this.calendarRepository = calendarRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<CalendarEvent> getEvents() {
        String orgId = TenantContext.getCurrentTenant();
        return calendarRepository.findByOrganizationId(orgId);
    }

    public CalendarEvent getEventById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return calendarRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar event not found with id: " + id));
    }

    @Transactional
    public CalendarEvent createEvent(CalendarEvent event) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        event.setOrganization(org);
        return calendarRepository.save(event);
    }

    @Transactional
    public CalendarEvent updateEvent(String id, CalendarEvent details) {
        CalendarEvent existing = getEventById(id);
        existing.setTitle(details.getTitle());
        existing.setDescription(details.getDescription());
        existing.setStartTime(details.getStartTime());
        existing.setEndTime(details.getEndTime());
        existing.setType(details.getType());
        existing.setStatus(details.getStatus());
        existing.setLocation(details.getLocation());
        return calendarRepository.save(existing);
    }

    @Transactional
    public void deleteEvent(String id) {
        CalendarEvent existing = getEventById(id);
        calendarRepository.delete(existing);
    }
}
