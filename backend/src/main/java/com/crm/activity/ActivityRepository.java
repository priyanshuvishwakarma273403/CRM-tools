package com.crm.activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, String> {

    @Query("SELECT a FROM Activity a WHERE a.organization.id = :orgId ORDER BY a.createdAt DESC")
    Page<Activity> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT a FROM Activity a WHERE a.organization.id = :orgId AND a.relatedEntityType = :entityType AND a.relatedEntityId = :entityId ORDER BY a.createdAt DESC")
    List<Activity> findByEntity(@Param("orgId") String orgId, @Param("entityType") String entityType, @Param("entityId") String entityId);
}
