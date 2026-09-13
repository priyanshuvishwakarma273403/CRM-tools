package com.crm.support;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, String> {

    Page<Ticket> findByOrganizationIdOrderByCreatedAtDesc(String organizationId, Pageable pageable);

    Page<Ticket> findByOrganizationIdAndStatusOrderByCreatedAtDesc(String organizationId, TicketStatus status, Pageable pageable);

    Page<Ticket> findByOrganizationIdAndPriorityOrderByCreatedAtDesc(String organizationId, TicketPriority priority, Pageable pageable);

    Page<Ticket> findByOrganizationIdAndStatusAndPriorityOrderByCreatedAtDesc(String organizationId, TicketStatus status, TicketPriority priority, Pageable pageable);

    Optional<Ticket> findByIdAndOrganizationId(String id, String organizationId);

    Optional<Ticket> findByTicketNumberAndOrganizationId(String ticketNumber, String organizationId);

    List<Ticket> findByOrganizationIdAndCustomerIdOrderByCreatedAtDesc(String organizationId, String customerId);

    long countByOrganizationId(String organizationId);

    long countByOrganizationIdAndStatus(String organizationId, TicketStatus status);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.organizationId = :orgId AND t.slaDueAt < :now AND t.status NOT IN ('RESOLVED', 'CLOSED')")
    long countSlaBreached(@Param("orgId") String orgId, @Param("now") LocalDateTime now);

    @Query("SELECT t FROM Ticket t WHERE t.organizationId = :orgId AND (LOWER(t.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.ticketNumber) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Ticket> searchTickets(@Param("orgId") String orgId, @Param("query") String query, Pageable pageable);
}
