package com.crm.lead;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.company.Company;
import com.crm.company.CompanyRepository;
import com.crm.contact.Contact;
import com.crm.contact.ContactRepository;
import com.crm.customer.Customer;
import com.crm.customer.CustomerRepository;
import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.deal.DealStage;
import com.crm.event.CrmDomainEvent;
import com.crm.event.DomainEventPublisher;
import com.crm.lead.dto.LeadConversionRequest;
import com.crm.lead.dto.LeadConversionResponse;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import com.crm.user.User;
import com.crm.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final OrganizationRepository organizationRepository;
    private final CompanyRepository companyRepository;
    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final LeadConversionRepository leadConversionRepository;
    private final UserRepository userRepository;
    private final DomainEventPublisher domainEventPublisher;

    public LeadService(LeadRepository leadRepository,
                       OrganizationRepository organizationRepository,
                       CompanyRepository companyRepository,
                       ContactRepository contactRepository,
                       CustomerRepository customerRepository,
                       DealRepository dealRepository,
                       LeadConversionRepository leadConversionRepository,
                       UserRepository userRepository,
                       DomainEventPublisher domainEventPublisher) {
        this.leadRepository = leadRepository;
        this.organizationRepository = organizationRepository;
        this.companyRepository = companyRepository;
        this.contactRepository = contactRepository;
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.leadConversionRepository = leadConversionRepository;
        this.userRepository = userRepository;
        this.domainEventPublisher = domainEventPublisher;
    }

    public Page<Lead> getLeads(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return leadRepository.findByOrganizationId(orgId, pageable);
    }

    public Lead getLeadById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return leadRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
    }

    @Transactional
    public Lead createLead(Lead lead) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        lead.setOrganization(org);
        Lead saved = leadRepository.save(lead);

        Map<String, Object> payload = new HashMap<>();
        payload.put("leadId", saved.getId());
        payload.put("firstName", saved.getFirstName());
        payload.put("lastName", saved.getLastName());
        payload.put("companyName", saved.getCompanyName());
        payload.put("email", saved.getEmail());
        payload.put("phone", saved.getPhone());
        payload.put("score", saved.getScore() != null ? saved.getScore() : 0);
        payload.put("status", saved.getStatus() != null ? saved.getStatus().name() : "NEW");

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("LEAD_CREATED")
                .entityType("LEAD")
                .entityId(saved.getId())
                .payload(payload)
                .build());

        return saved;
    }

    @Transactional
    public Lead updateLead(String id, Lead leadDetails) {
        Lead existing = getLeadById(id);
        existing.setFirstName(leadDetails.getFirstName());
        existing.setLastName(leadDetails.getLastName());
        existing.setCompanyName(leadDetails.getCompanyName());
        existing.setEmail(leadDetails.getEmail());
        existing.setPhone(leadDetails.getPhone());
        existing.setStatus(leadDetails.getStatus());
        existing.setScore(leadDetails.getScore());
        existing.setSource(leadDetails.getSource());
        existing.setNextFollowUp(leadDetails.getNextFollowUp());
        return leadRepository.save(existing);
    }

    @Transactional
    public Lead updateStatus(String id, LeadStatus status) {
        Lead existing = getLeadById(id);
        existing.setStatus(status);
        return leadRepository.save(existing);
    }

    @Transactional
    public void deleteLead(String id) {
        Lead existing = getLeadById(id);
        existing.setDeletedAt(LocalDateTime.now());
        leadRepository.save(existing);
    }

    /**
     * Backward-compatible lead conversion returning Lead entity.
     */
    @Transactional
    public Lead convertLead(String id) {
        convertLead(id, new LeadConversionRequest());
        return getLeadById(id);
    }

    /**
     * Full Enterprise Lead Conversion.
     * Atomically creates Company, Contact, optional Customer 360, and optional Deal,
     * tracks conversion history in lead_conversions, and publishes LEAD_CONVERTED domain event.
     */
    @Transactional
    public LeadConversionResponse convertLead(String id, LeadConversionRequest request) {
        if (request == null) {
            request = new LeadConversionRequest();
        }

        Lead lead = getLeadById(id);
        if (lead.getStatus() == LeadStatus.CONVERTED) {
            throw new IllegalStateException("Lead is already converted");
        }

        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        User owner = null;
        if (request.getOwnerId() != null) {
            owner = userRepository.findById(request.getOwnerId()).orElse(null);
        }

        // 1. Resolve or Create Company
        Company company = null;
        if (Boolean.TRUE.equals(request.getCreateCompany())) {
            String companyName = (request.getCompanyName() != null && !request.getCompanyName().isBlank())
                    ? request.getCompanyName()
                    : lead.getCompanyName();

            if (companyName != null && !companyName.isBlank()) {
                final String finalName = companyName;
                company = companyRepository.findByNameIgnoreCaseAndOrganizationId(companyName, orgId)
                        .orElseGet(() -> companyRepository.save(Company.builder()
                                .organization(org)
                                .name(finalName)
                                .phone(lead.getPhone())
                                .build()));
            }
        }

        // 2. Create Contact
        Contact contact = Contact.builder()
                .organization(org)
                .company(company)
                .firstName(lead.getFirstName())
                .lastName(lead.getLastName() != null ? lead.getLastName() : "")
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .notes("Converted from Lead: " + lead.getId())
                .build();
        contact = contactRepository.save(contact);

        // 3. Create Customer 360 Account
        Customer customer = null;
        if (Boolean.TRUE.equals(request.getCreateCustomer())) {
            String customerName = (company != null)
                    ? company.getName()
                    : (lead.getFirstName() + " " + (lead.getLastName() != null ? lead.getLastName() : "")).trim();

            customer = customerRepository.save(Customer.builder()
                    .organizationId(orgId)
                    .name(customerName)
                    .company(company)
                    .primaryContact(contact)
                    .owner(owner)
                    .status("ACTIVE")
                    .tier("STANDARD")
                    .healthScore(85)
                    .build());
        }

        // 4. Create Optional Deal
        Deal deal = null;
        if (Boolean.TRUE.equals(request.getCreateDeal())) {
            String dealTitle = (request.getDealTitle() != null && !request.getDealTitle().isBlank())
                    ? request.getDealTitle()
                    : "Deal - " + (company != null ? company.getName() : lead.getFirstName());

            BigDecimal dealValue = request.getDealValue() != null ? request.getDealValue() : BigDecimal.ZERO;

            deal = dealRepository.save(Deal.builder()
                    .organization(org)
                    .owner(owner)
                    .company(company)
                    .contact(contact)
                    .customerId(customer != null ? customer.getId() : null)
                    .title(dealTitle)
                    .value(dealValue)
                    .stage(DealStage.QUALIFIED)
                    .probability(25)
                    .notes("Generated from lead conversion")
                    .build());
        }

        // 5. Update Lead Status
        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);

        // 6. Record Lead Conversion Audit
        LeadConversion conversion = LeadConversion.builder()
                .organizationId(orgId)
                .leadId(lead.getId())
                .companyId(company != null ? company.getId() : null)
                .contactId(contact.getId())
                .customerId(customer != null ? customer.getId() : null)
                .dealId(deal != null ? deal.getId() : null)
                .convertedByUserId(owner != null ? owner.getId() : null)
                .convertedAt(LocalDateTime.now())
                .build();
        leadConversionRepository.save(conversion);

        // 7. Publish Domain Event
        Map<String, Object> eventPayload = new HashMap<>();
        eventPayload.put("leadId", lead.getId());
        eventPayload.put("companyId", company != null ? company.getId() : "");
        eventPayload.put("contactId", contact.getId());
        eventPayload.put("customerId", customer != null ? customer.getId() : "");
        eventPayload.put("dealId", deal != null ? deal.getId() : "");
        eventPayload.put("score", lead.getScore() != null ? lead.getScore() : 0);

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("LEAD_CONVERTED")
                .entityType("LEAD")
                .entityId(lead.getId())
                .actorId(owner != null ? owner.getId() : "system")
                .payload(eventPayload)
                .build());

        return LeadConversionResponse.builder()
                .leadId(lead.getId())
                .companyId(company != null ? company.getId() : null)
                .companyName(company != null ? company.getName() : null)
                .contactId(contact.getId())
                .contactName(contact.getFirstName() + " " + contact.getLastName())
                .customerId(customer != null ? customer.getId() : null)
                .customerName(customer != null ? customer.getName() : null)
                .dealId(deal != null ? deal.getId() : null)
                .dealTitle(deal != null ? deal.getTitle() : null)
                .convertedAt(conversion.getConvertedAt())
                .message("Lead successfully converted")
                .build();
    }
}
