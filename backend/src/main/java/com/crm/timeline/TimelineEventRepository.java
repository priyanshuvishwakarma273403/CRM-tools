package com.crm.timeline;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimelineEventRepository extends JpaRepository<TimelineEvent, String> {

    Page<TimelineEvent> findByOrganizationIdAndEntityTypeAndEntityIdOrderByCreatedAtDesc(
            String organizationId, String entityType, String entityId, Pageable pageable);

    List<TimelineEvent> findByOrganizationIdAndEntityTypeAndEntityIdOrderByCreatedAtDesc(
            String organizationId, String entityType, String entityId);

    Page<TimelineEvent> findByOrganizationIdOrderByCreatedAtDesc(String organizationId, Pageable pageable);
}
