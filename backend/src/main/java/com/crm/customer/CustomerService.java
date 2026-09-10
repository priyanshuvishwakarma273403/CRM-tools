package com.crm.customer;

import com.crm.communication.CommunicationRepository;
import com.crm.deal.DealRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final CommunicationRepository communicationRepository;

    public CustomerService(CustomerRepository customerRepository,
                           DealRepository dealRepository,
                           CommunicationRepository communicationRepository) {
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.communicationRepository = communicationRepository;
    }

    public Page<Customer> getCustomers(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return customerRepository.findAllByOrganizationId(orgId, pageable);
    }

    public Customer getCustomerById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return customerRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    /**
     * Customer 360 Aggregation.
     * Consolidates customer profile, active deals, communications timeline, and health metrics into one payload.
     */
    public Map<String, Object> getCustomer360(String id) {
        Customer customer = getCustomerById(id);
        String orgId = TenantContext.getCurrentTenant();

        Map<String, Object> c360 = new HashMap<>();
        c360.put("customer", customer);
        c360.put("deals", dealRepository.findAllByOrganizationId(orgId));
        c360.put("communications", communicationRepository.findAllByOrganizationIdAndCustomerIdOrderByCreatedAtDesc(orgId, id));
        c360.put("healthSummary", Map.of(
                "healthScore", customer.getHealthScore() != null ? customer.getHealthScore() : 85,
                "tier", customer.getTier(),
                "churnProbability", customer.getChurnProbability(),
                "lifetimeValue", customer.getLifetimeValue()
        ));

        return c360;
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        String orgId = TenantContext.getCurrentTenant();
        customer.setOrganizationId(orgId);
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(String id, Customer updated) {
        Customer existing = getCustomerById(id);
        existing.setName(updated.getName());
        existing.setIndustry(updated.getIndustry());
        existing.setTier(updated.getTier());
        existing.setStatus(updated.getStatus());
        existing.setHealthScore(updated.getHealthScore());
        existing.setLifetimeValue(updated.getLifetimeValue());
        existing.setAnnualRecurringRevenue(updated.getAnnualRecurringRevenue());
        existing.setChurnProbability(updated.getChurnProbability());
        existing.setTags(updated.getTags());
        existing.setCustomAttributesJson(updated.getCustomAttributesJson());
        return customerRepository.save(existing);
    }

    @Transactional
    public void deleteCustomer(String id) {
        Customer existing = getCustomerById(id);
        customerRepository.delete(existing);
    }
}
