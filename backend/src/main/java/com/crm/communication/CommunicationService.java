package com.crm.communication;

import com.crm.common.exception.BadRequestException;
import com.crm.common.exception.ResourceNotFoundException;
import com.crm.communication.dto.*;
import com.crm.contact.Contact;
import com.crm.contact.ContactRepository;
import com.crm.customer.Customer;
import com.crm.customer.CustomerRepository;
import com.crm.event.CrmDomainEvent;
import com.crm.event.DomainEventPublisher;
import com.crm.lead.Lead;
import com.crm.lead.LeadRepository;
import com.crm.security.TenantContext;
import com.crm.user.User;
import com.crm.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class CommunicationService {

    private static final Pattern TEMPLATE_VARIABLE_PATTERN = Pattern.compile("\\{\\{\\s*([a-zA-Z0-9_]+)\\s*\\}\\}");

    private final CommunicationRepository communicationRepository;
    private final CommunicationTemplateRepository templateRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final DomainEventPublisher domainEventPublisher;
    private final ObjectMapper objectMapper;

    public CommunicationService(CommunicationRepository communicationRepository,
                                CommunicationTemplateRepository templateRepository,
                                CustomerRepository customerRepository,
                                LeadRepository leadRepository,
                                ContactRepository contactRepository,
                                UserRepository userRepository,
                                DomainEventPublisher domainEventPublisher,
                                ObjectMapper objectMapper) {
        this.communicationRepository = communicationRepository;
        this.templateRepository = templateRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.domainEventPublisher = domainEventPublisher;
        this.objectMapper = objectMapper;
    }

    public Page<CommunicationLog> getCommunications(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return communicationRepository.findAllByOrganizationIdOrderByCreatedAtDesc(orgId, pageable);
    }

    public List<CommunicationLog> getCustomerTimeline(String customerId) {
        String orgId = TenantContext.getCurrentTenant();
        return communicationRepository.findAllByOrganizationIdAndCustomerIdOrderByCreatedAtDesc(orgId, customerId);
    }

    public List<CommunicationLog> getLeadTimeline(String leadId) {
        String orgId = TenantContext.getCurrentTenant();
        return communicationRepository.findAllByOrganizationIdAndLeadIdOrderByCreatedAtDesc(orgId, leadId);
    }

    public List<CommunicationLog> getDealTimeline(String dealId) {
        String orgId = TenantContext.getCurrentTenant();
        return communicationRepository.findAllByOrganizationIdAndDealIdOrderByCreatedAtDesc(orgId, dealId);
    }

    public List<CommunicationLog> getTicketTimeline(String ticketId) {
        String orgId = TenantContext.getCurrentTenant();
        return communicationRepository.findAllByOrganizationIdAndTicketIdOrderByCreatedAtDesc(orgId, ticketId);
    }

    public List<CommunicationLog> getThread(String threadId) {
        String orgId = TenantContext.getCurrentTenant();
        return communicationRepository.findAllByOrganizationIdAndThreadIdOrderByCreatedAtAsc(orgId, threadId);
    }

    @Transactional
    public CommunicationLog logCommunication(CommunicationLog logEntry) {
        String orgId = TenantContext.getCurrentTenant();
        logEntry.setOrganizationId(orgId);
        if (logEntry.getThreadId() == null) {
            logEntry.setThreadId(UUID.randomUUID().toString());
        }
        CommunicationLog saved = communicationRepository.save(logEntry);

        publishCommunicationEvent("COMMUNICATION_LOGGED", saved);
        return saved;
    }

    @Transactional
    public CommunicationLog sendMessage(SendMessageRequest request) {
        String orgId = TenantContext.getCurrentTenant();

        String subject = request.getSubject();
        String content = request.getContent();
        String templateId = request.getTemplateId();

        // 1. Process Template if provided
        if (templateId != null && !templateId.isBlank()) {
            CommunicationTemplate template = templateRepository.findByIdAndOrganizationId(templateId, orgId)
                    .orElseThrow(() -> new ResourceNotFoundException("Communication template not found with id: " + templateId));

            Map<String, Object> vars = request.getTemplateVariables() != null ? request.getTemplateVariables() : Collections.emptyMap();
            if (subject == null || subject.isBlank()) {
                subject = renderString(template.getSubject(), vars);
            }
            if (content == null || content.isBlank()) {
                content = renderString(template.getBodyTemplate(), vars);
            }
        }

        // 2. Resolve Threading
        String threadId = request.getThreadId();
        String parentId = request.getParentId();
        if (parentId != null && !parentId.isBlank() && (threadId == null || threadId.isBlank())) {
            CommunicationLog parent = communicationRepository.findById(parentId).orElse(null);
            if (parent != null) {
                threadId = parent.getThreadId() != null ? parent.getThreadId() : parent.getId();
            }
        }
        if (threadId == null || threadId.isBlank()) {
            threadId = UUID.randomUUID().toString();
        }

        // 3. Resolve Customer & Lead
        Customer customer = null;
        if (request.getCustomerId() != null && !request.getCustomerId().isBlank()) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
        }

        Lead lead = null;
        if (request.getLeadId() != null && !request.getLeadId().isBlank()) {
            lead = leadRepository.findById(request.getLeadId()).orElse(null);
        }

        // 4. Build and Save Communication Log
        CommunicationLog logEntry = CommunicationLog.builder()
                .organizationId(orgId)
                .channel(request.getChannel().toUpperCase())
                .direction("OUTBOUND")
                .subject(subject)
                .content(content)
                .sender(request.getSender() != null ? request.getSender() : "system")
                .recipient(request.getRecipient())
                .status("SENT")
                .sentiment("NEUTRAL")
                .threadId(threadId)
                .parentId(parentId)
                .templateId(templateId)
                .dealId(request.getDealId())
                .ticketId(request.getTicketId())
                .customer(customer)
                .lead(lead)
                .createdAt(LocalDateTime.now())
                .build();

        CommunicationLog saved = communicationRepository.save(logEntry);

        // 5. Emit Domain Event
        publishCommunicationEvent("COMMUNICATION_SENT", saved);
        return saved;
    }

    @Transactional
    public CommunicationLog receiveInboundMessage(InboundMessageRequest request) {
        String orgId = TenantContext.getCurrentTenant();

        // 1. Auto-resolve Lead, Contact, or Customer by sender email or phone
        Lead matchingLead = null;
        Customer matchingCustomer = null;
        String sender = request.getSender().trim();

        if (sender.contains("@")) {
            matchingLead = leadRepository.findFirstByOrganizationIdAndEmailIgnoreCaseAndDeletedAtIsNull(orgId, sender).orElse(null);
            if (matchingLead == null) {
                Contact contact = contactRepository.findFirstByOrganizationIdAndEmailIgnoreCase(orgId, sender).orElse(null);
                if (contact != null) {
                    matchingCustomer = customerRepository.findFirstByOrganizationIdAndPrimaryContactId(orgId, contact.getId())
                            .or(() -> contact.getCompanyId() != null
                                    ? customerRepository.findFirstByOrganizationIdAndCompanyId(orgId, contact.getCompanyId())
                                    : Optional.empty())
                            .orElse(null);
                }
            }
        } else {
            matchingLead = leadRepository.findFirstByOrganizationIdAndPhoneAndDeletedAtIsNull(orgId, sender).orElse(null);
            if (matchingLead == null) {
                Contact contact = contactRepository.findFirstByOrganizationIdAndPhone(orgId, sender).orElse(null);
                if (contact != null) {
                    matchingCustomer = customerRepository.findFirstByOrganizationIdAndPrimaryContactId(orgId, contact.getId())
                            .or(() -> contact.getCompanyId() != null
                                    ? customerRepository.findFirstByOrganizationIdAndCompanyId(orgId, contact.getCompanyId())
                                    : Optional.empty())
                            .orElse(null);
                }
            }
        }

        // 2. Resolve Thread
        String threadId = request.getThreadId();
        if (threadId == null || threadId.isBlank()) {
            threadId = UUID.randomUUID().toString();
        }

        // 3. Detect Sentiment
        String sentiment = detectSentiment(request.getContent());

        // 4. Metadata JSON
        String metadataJson = null;
        if (request.getMetadata() != null) {
            try {
                metadataJson = objectMapper.writeValueAsString(request.getMetadata());
            } catch (JsonProcessingException e) {
                log.warn("Failed to serialize inbound metadata: {}", e.getMessage());
            }
        }

        CommunicationLog logEntry = CommunicationLog.builder()
                .organizationId(orgId)
                .channel(request.getChannel().toUpperCase())
                .direction("INBOUND")
                .subject(request.getSubject() != null ? request.getSubject() : "Inbound " + request.getChannel())
                .content(request.getContent())
                .sender(sender)
                .recipient(request.getRecipient() != null ? request.getRecipient() : "CRM Inbound Gateway")
                .status("RECEIVED")
                .sentiment(sentiment)
                .threadId(threadId)
                .customer(matchingCustomer)
                .lead(matchingLead)
                .metadataJson(metadataJson)
                .createdAt(LocalDateTime.now())
                .build();

        CommunicationLog saved = communicationRepository.save(logEntry);

        // 5. Publish Domain Event
        publishCommunicationEvent("COMMUNICATION_RECEIVED", saved);
        return saved;
    }

    // --- Template Management ---

    public List<CommunicationTemplate> getTemplates(String channel, String category) {
        String orgId = TenantContext.getCurrentTenant();
        if (channel != null && !channel.isBlank()) {
            return templateRepository.findAllByOrganizationIdAndChannelOrderByCreatedAtDesc(orgId, channel.toUpperCase());
        }
        if (category != null && !category.isBlank()) {
            return templateRepository.findAllByOrganizationIdAndCategoryOrderByCreatedAtDesc(orgId, category.toUpperCase());
        }
        return templateRepository.findAllByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public CommunicationTemplate getTemplateById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return templateRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Communication template not found: " + id));
    }

    @Transactional
    public CommunicationTemplate createTemplate(CreateTemplateRequest request) {
        String orgId = TenantContext.getCurrentTenant();

        String varsJson = null;
        if (request.getVariables() != null) {
            try {
                varsJson = objectMapper.writeValueAsString(request.getVariables());
            } catch (JsonProcessingException e) {
                log.warn("Failed to serialize template variables: {}", e.getMessage());
            }
        }

        CommunicationTemplate template = CommunicationTemplate.builder()
                .organizationId(orgId)
                .name(request.getName())
                .channel(request.getChannel().toUpperCase())
                .subject(request.getSubject())
                .bodyTemplate(request.getBodyTemplate())
                .variablesJson(varsJson)
                .category(request.getCategory() != null ? request.getCategory().toUpperCase() : "GENERAL")
                .isActive(true)
                .build();

        return templateRepository.save(template);
    }

    @Transactional
    public CommunicationTemplate updateTemplate(String id, UpdateTemplateRequest request) {
        CommunicationTemplate existing = getTemplateById(id);

        if (request.getName() != null && !request.getName().isBlank()) {
            existing.setName(request.getName());
        }
        if (request.getChannel() != null && !request.getChannel().isBlank()) {
            existing.setChannel(request.getChannel().toUpperCase());
        }
        if (request.getSubject() != null) {
            existing.setSubject(request.getSubject());
        }
        if (request.getBodyTemplate() != null && !request.getBodyTemplate().isBlank()) {
            existing.setBodyTemplate(request.getBodyTemplate());
        }
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            existing.setCategory(request.getCategory().toUpperCase());
        }
        if (request.getIsActive() != null) {
            existing.setIsActive(request.getIsActive());
        }
        if (request.getVariables() != null) {
            try {
                existing.setVariablesJson(objectMapper.writeValueAsString(request.getVariables()));
            } catch (JsonProcessingException e) {
                log.warn("Failed to update template variables: {}", e.getMessage());
            }
        }

        return templateRepository.save(existing);
    }

    @Transactional
    public void deleteTemplate(String id) {
        CommunicationTemplate existing = getTemplateById(id);
        templateRepository.delete(existing);
    }

    public RenderedTemplateResponse renderTemplate(String id, RenderTemplateRequest request) {
        CommunicationTemplate template = getTemplateById(id);
        Map<String, Object> vars = request.getVariables() != null ? request.getVariables() : Collections.emptyMap();

        String renderedSubject = renderString(template.getSubject(), vars);
        String renderedBody = renderString(template.getBodyTemplate(), vars);

        return RenderedTemplateResponse.builder()
                .templateId(template.getId())
                .templateName(template.getName())
                .channel(template.getChannel())
                .renderedSubject(renderedSubject)
                .renderedBody(renderedBody)
                .build();
    }

    private String renderString(String template, Map<String, Object> variables) {
        if (template == null) return null;
        if (variables == null || variables.isEmpty()) return template;

        Matcher matcher = TEMPLATE_VARIABLE_PATTERN.matcher(template);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            String varName = matcher.group(1);
            Object val = variables.get(varName);
            String replacement = (val != null) ? val.toString() : matcher.group(0);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String detectSentiment(String content) {
        if (content == null) return "NEUTRAL";
        String lower = content.toLowerCase();
        if (lower.contains("cancel") || lower.contains("broken") || lower.contains("fail") ||
                lower.contains("angry") || lower.contains("terrible") || lower.contains("bad") ||
                lower.contains("error") || lower.contains("bug") || lower.contains("urgent")) {
            return "NEGATIVE";
        }
        if (lower.contains("thanks") || lower.contains("thank you") || lower.contains("great") ||
                lower.contains("awesome") || lower.contains("love") || lower.contains("resolved") ||
                lower.contains("excellent") || lower.contains("happy")) {
            return "POSITIVE";
        }
        return "NEUTRAL";
    }

    private void publishCommunicationEvent(String eventType, CommunicationLog logEntry) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("communicationId", logEntry.getId());
        payload.put("channel", logEntry.getChannel());
        payload.put("direction", logEntry.getDirection());
        payload.put("sender", logEntry.getSender());
        payload.put("recipient", logEntry.getRecipient());
        payload.put("subject", logEntry.getSubject());
        payload.put("threadId", logEntry.getThreadId());
        payload.put("sentiment", logEntry.getSentiment());
        if (logEntry.getCustomer() != null) {
            payload.put("customerId", logEntry.getCustomer().getId());
        }
        if (logEntry.getLead() != null) {
            payload.put("leadId", logEntry.getLead().getId());
        }
        if (logEntry.getDealId() != null) {
            payload.put("dealId", logEntry.getDealId());
        }
        if (logEntry.getTicketId() != null) {
            payload.put("ticketId", logEntry.getTicketId());
        }

        String entityType = "COMMUNICATION";
        String entityId = logEntry.getId();
        if (logEntry.getCustomer() != null) {
            entityType = "CUSTOMER";
            entityId = logEntry.getCustomer().getId();
        } else if (logEntry.getLead() != null) {
            entityType = "LEAD";
            entityId = logEntry.getLead().getId();
        }

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(logEntry.getOrganizationId())
                .eventType(eventType)
                .entityType(entityType)
                .entityId(entityId)
                .payload(payload)
                .build());
    }
}
