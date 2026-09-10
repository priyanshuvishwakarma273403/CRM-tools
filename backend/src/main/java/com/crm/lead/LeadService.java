package com.crm.lead;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final OrganizationRepository organizationRepository;
    private final com.crm.websocket.CrmEventPublisher eventPublisher;

    public LeadService(LeadRepository leadRepository, 
                       OrganizationRepository organizationRepository,
                       com.crm.websocket.CrmEventPublisher eventPublisher) {
        this.leadRepository = leadRepository;
        this.organizationRepository = organizationRepository;
        this.eventPublisher = eventPublisher;
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
        eventPublisher.publishEvent("LEAD_CREATED", orgId, saved);
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

    @Transactional
    public Lead convertLead(String id) {
        Lead lead = getLeadById(id);
        lead.setStatus(LeadStatus.CONVERTED);
        return leadRepository.save(lead);
    }
}
