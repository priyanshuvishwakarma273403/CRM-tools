package com.crm.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    @Query("SELECT n FROM Notification n WHERE n.organization.id = :orgId AND n.userId = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findByOrgAndUser(@Param("orgId") String orgId, @Param("userId") String userId, Pageable pageable);
}
