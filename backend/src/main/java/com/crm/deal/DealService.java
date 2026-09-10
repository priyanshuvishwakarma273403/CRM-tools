package com.crm.deal;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final OrganizationRepository organizationRepository;
    private final com.crm.websocket.CrmEventPublisher eventPublisher;

    public DealService(DealRepository dealRepository, 
                       OrganizationRepository organizationRepository,
                       com.crm.websocket.CrmEventPublisher eventPublisher) {
        this.dealRepository = dealRepository;
        this.organizationRepository = organizationRepository;
        this.eventPublisher = eventPublisher;
    }

    public List<Deal> getAllDeals() {
        String orgId = TenantContext.getCurrentTenant();
        return dealRepository.findAllByOrganizationId(orgId);
    }

    public Page<Deal> getDeals(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return dealRepository.findByOrganizationId(orgId, pageable);
    }

    public Deal getDealById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return dealRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + id));
    }

    @Transactional
    public Deal createDeal(Deal deal) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        deal.setOrganization(org);
        Deal saved = dealRepository.save(deal);
        eventPublisher.publishEvent("DEAL_CREATED", orgId, saved);
        return saved;
    }

    @Transactional
    public Deal updateDeal(String id, Deal details) {
        Deal existing = getDealById(id);
        existing.setTitle(details.getTitle());
        existing.setValue(details.getValue());
        existing.setStage(details.getStage());
        existing.setProbability(details.getProbability());
        existing.setExpectedCloseDate(details.getExpectedCloseDate());
        Deal saved = dealRepository.save(existing);
        eventPublisher.publishEvent("DEAL_UPDATED", TenantContext.getCurrentTenant(), saved);
        return saved;
    }

    @Transactional
    public Deal updateStage(String id, DealStage stage) {
        Deal existing = getDealById(id);
        existing.setStage(stage);
        Deal saved = dealRepository.save(existing);
        eventPublisher.publishEvent("DEAL_STAGE_CHANGED", TenantContext.getCurrentTenant(), saved);
        return saved;
    }

    @Transactional
    public void deleteDeal(String id) {
        Deal existing = getDealById(id);
        dealRepository.delete(existing);
    }
}
