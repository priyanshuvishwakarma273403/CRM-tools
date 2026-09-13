package com.crm.support;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketCommentRepository extends JpaRepository<TicketComment, String> {
    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(String ticketId);
    List<TicketComment> findByTicketIdAndIsInternalFalseOrderByCreatedAtAsc(String ticketId);
}
