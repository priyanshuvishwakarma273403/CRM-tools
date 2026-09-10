package com.crm.communication;

import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunicationService {

    private final CommunicationRepository communicationRepository;

    public CommunicationService(CommunicationRepository communicationRepository) {
        this.communicationRepository = communicationRepository;
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

    @Transactional
    public CommunicationLog logCommunication(CommunicationLog log) {
        String orgId = TenantContext.getCurrentTenant();
        log.setOrganizationId(orgId);
        return communicationRepository.save(log);
    }
}
