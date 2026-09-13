package com.crm.support;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.event.CrmDomainEvent;
import com.crm.event.DomainEventPublisher;
import com.crm.security.TenantContext;
import com.crm.support.dto.AddCommentRequest;
import com.crm.support.dto.CreateTicketRequest;
import com.crm.support.dto.CsatFeedbackRequest;
import com.crm.support.dto.UpdateTicketRequest;
import com.crm.user.User;
import com.crm.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final SlaPolicyRepository slaPolicyRepository;
    private final UserRepository userRepository;
    private final DomainEventPublisher domainEventPublisher;

    public TicketService(TicketRepository ticketRepository,
                         TicketCommentRepository ticketCommentRepository,
                         SlaPolicyRepository slaPolicyRepository,
                         UserRepository userRepository,
                         DomainEventPublisher domainEventPublisher) {
        this.ticketRepository = ticketRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.slaPolicyRepository = slaPolicyRepository;
        this.userRepository = userRepository;
        this.domainEventPublisher = domainEventPublisher;
    }

    public Page<Ticket> getTickets(TicketStatus status, TicketPriority priority, Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        if (status != null && priority != null) {
            return ticketRepository.findByOrganizationIdAndStatusAndPriorityOrderByCreatedAtDesc(orgId, status, priority, pageable);
        } else if (status != null) {
            return ticketRepository.findByOrganizationIdAndStatusOrderByCreatedAtDesc(orgId, status, pageable);
        } else if (priority != null) {
            return ticketRepository.findByOrganizationIdAndPriorityOrderByCreatedAtDesc(orgId, priority, pageable);
        }
        return ticketRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId, pageable);
    }

    public Ticket getTicketById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return ticketRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    @Transactional
    public Ticket createTicket(CreateTicketRequest request) {
        String orgId = TenantContext.getCurrentTenant();

        // 1. Generate human-readable ticket number
        long count = ticketRepository.countByOrganizationId(orgId);
        String ticketNumber = String.format("TCK-%04d", count + 1);

        // 2. Resolve SLA target
        TicketPriority priority = request.getPriority() != null ? request.getPriority() : TicketPriority.MEDIUM;
        LocalDateTime slaDueAt = computeSlaDueAt(orgId, priority);

        // 3. Resolve Assignee
        User assignee = null;
        if (request.getAssigneeId() != null && !request.getAssigneeId().isBlank()) {
            assignee = userRepository.findById(request.getAssigneeId()).orElse(null);
        }

        Ticket ticket = Ticket.builder()
                .organizationId(orgId)
                .ticketNumber(ticketNumber)
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(TicketStatus.OPEN)
                .priority(priority)
                .category(request.getCategory())
                .customerId(request.getCustomerId())
                .contactId(request.getContactId())
                .assignee(assignee)
                .slaDueAt(slaDueAt)
                .build();

        Ticket saved = ticketRepository.save(ticket);

        // 4. Publish Domain Event
        Map<String, Object> payload = new HashMap<>();
        payload.put("ticketId", saved.getId());
        payload.put("ticketNumber", saved.getTicketNumber());
        payload.put("subject", saved.getSubject());
        payload.put("priority", saved.getPriority().name());
        payload.put("status", saved.getStatus().name());
        payload.put("customerId", saved.getCustomerId());
        payload.put("assigneeId", assignee != null ? assignee.getId() : null);

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("TICKET_CREATED")
                .entityType("TICKET")
                .entityId(saved.getId())
                .actorId(assignee != null ? assignee.getId() : "system")
                .payload(payload)
                .build());

        return saved;
    }

    @Transactional
    public Ticket updateTicket(String id, UpdateTicketRequest request) {
        Ticket existing = getTicketById(id);
        if (request.getSubject() != null) existing.setSubject(request.getSubject());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getCategory() != null) existing.setCategory(request.getCategory());
        if (request.getPriority() != null && request.getPriority() != existing.getPriority()) {
            existing.setPriority(request.getPriority());
            existing.setSlaDueAt(computeSlaDueAt(existing.getOrganizationId(), request.getPriority()));
        }
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId()).orElse(null);
            existing.setAssignee(assignee);
        }
        return ticketRepository.save(existing);
    }

    @Transactional
    public Ticket updateStatus(String id, TicketStatus newStatus) {
        Ticket existing = getTicketById(id);
        TicketStatus oldStatus = existing.getStatus();
        existing.setStatus(newStatus);

        if (newStatus == TicketStatus.RESOLVED && existing.getResolvedAt() == null) {
            existing.setResolvedAt(LocalDateTime.now());
        }
        if (newStatus == TicketStatus.CLOSED && existing.getClosedAt() == null) {
            existing.setClosedAt(LocalDateTime.now());
        }

        Ticket saved = ticketRepository.save(existing);

        Map<String, Object> payload = new HashMap<>();
        payload.put("ticketId", saved.getId());
        payload.put("ticketNumber", saved.getTicketNumber());
        payload.put("oldStatus", oldStatus.name());
        payload.put("newStatus", newStatus.name());

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(existing.getOrganizationId())
                .eventType("TICKET_STATUS_CHANGED")
                .entityType("TICKET")
                .entityId(saved.getId())
                .payload(payload)
                .build());

        return saved;
    }

    @Transactional
    public Ticket assignTicket(String id, String assigneeId) {
        Ticket existing = getTicketById(id);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + assigneeId));

        existing.setAssignee(assignee);
        if (existing.getStatus() == TicketStatus.OPEN) {
            existing.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket saved = ticketRepository.save(existing);

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(existing.getOrganizationId())
                .eventType("TICKET_ASSIGNED")
                .entityType("TICKET")
                .entityId(saved.getId())
                .payload(Map.of(
                        "ticketId", saved.getId(),
                        "ticketNumber", saved.getTicketNumber(),
                        "assigneeId", assignee.getId(),
                        "assigneeName", assignee.getFullName()
                ))
                .build());

        return saved;
    }

    @Transactional
    public TicketComment addComment(String ticketId, AddCommentRequest request, String userId, String userName) {
        Ticket ticket = getTicketById(ticketId);

        String validAuthorId = null;
        if (userId != null && userRepository.existsById(userId)) {
            validAuthorId = userId;
            User u = userRepository.findById(userId).orElse(null);
            if (u != null && u.getFullName() != null) {
                userName = u.getFullName();
            }
        }

        TicketComment comment = TicketComment.builder()
                .ticketId(ticket.getId())
                .authorId(validAuthorId)
                .authorName(userName != null ? userName : "Support Agent")
                .body(request.getBody())
                .isInternal(Boolean.TRUE.equals(request.getIsInternal()))
                .build();

        TicketComment saved = ticketCommentRepository.save(comment);

        // If public reply and first response not yet recorded, set first response time
        if (!Boolean.TRUE.equals(request.getIsInternal()) && ticket.getFirstRespondedAt() == null) {
            ticket.setFirstRespondedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(ticket.getOrganizationId())
                .eventType("TICKET_COMMENT_ADDED")
                .entityType("TICKET")
                .entityId(ticket.getId())
                .payload(Map.of(
                        "commentId", saved.getId(),
                        "isInternal", saved.getIsInternal(),
                        "ticketNumber", ticket.getTicketNumber()
                ))
                .build());

        return saved;
    }

    public List<TicketComment> getComments(String ticketId) {
        getTicketById(ticketId); // Validate existence and tenant ownership
        return ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    @Transactional
    public Ticket submitCsat(String id, CsatFeedbackRequest request) {
        Ticket ticket = getTicketById(id);
        ticket.setCsatRating(request.getRating());
        ticket.setCsatComment(request.getComment());
        return ticketRepository.save(ticket);
    }

    public Map<String, Object> getMetrics() {
        String orgId = TenantContext.getCurrentTenant();
        long open = ticketRepository.countByOrganizationIdAndStatus(orgId, TicketStatus.OPEN);
        long inProgress = ticketRepository.countByOrganizationIdAndStatus(orgId, TicketStatus.IN_PROGRESS);
        long pendingCustomer = ticketRepository.countByOrganizationIdAndStatus(orgId, TicketStatus.PENDING_CUSTOMER);
        long resolved = ticketRepository.countByOrganizationIdAndStatus(orgId, TicketStatus.RESOLVED);
        long closed = ticketRepository.countByOrganizationIdAndStatus(orgId, TicketStatus.CLOSED);
        long total = ticketRepository.countByOrganizationId(orgId);
        long slaBreached = ticketRepository.countSlaBreached(orgId, LocalDateTime.now());

        return Map.of(
                "total", total,
                "open", open,
                "inProgress", inProgress,
                "pendingCustomer", pendingCustomer,
                "resolved", resolved,
                "closed", closed,
                "slaBreached", slaBreached
        );
    }

    private LocalDateTime computeSlaDueAt(String orgId, TicketPriority priority) {
        return slaPolicyRepository.findByOrganizationIdAndPriorityAndIsActiveTrue(orgId, priority.name())
                .map(policy -> LocalDateTime.now().plusMinutes(policy.getResolutionTimeMinutes()))
                .orElseGet(() -> {
                    // Default SLA fallbacks
                    return switch (priority) {
                        case URGENT -> LocalDateTime.now().plusHours(2);
                        case HIGH -> LocalDateTime.now().plusHours(4);
                        case MEDIUM -> LocalDateTime.now().plusHours(8);
                        case LOW -> LocalDateTime.now().plusHours(24);
                    };
                });
    }
}
