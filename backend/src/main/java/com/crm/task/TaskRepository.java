package com.crm.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, String> {

    @Query("SELECT t FROM Task t WHERE t.organization.id = :orgId")
    Page<Task> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.id = :id AND t.organization.id = :orgId")
    Optional<Task> findByIdAndOrganizationId(@Param("id") String id, @Param("orgId") String orgId);

    @Query("SELECT t FROM Task t WHERE t.organization.id = :orgId AND t.relatedEntityType = :entityType AND t.relatedEntityId = :entityId")
    List<Task> findByRelatedEntity(@Param("orgId") String orgId, @Param("entityType") String entityType, @Param("entityId") String entityId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.organization.id = :orgId AND t.status = 'COMPLETED'")
    long countCompletedByOrganizationId(@Param("orgId") String orgId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.organization.id = :orgId")
    long countByOrganizationId(@Param("orgId") String orgId);
}
