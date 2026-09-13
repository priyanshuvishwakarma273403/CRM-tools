package com.crm.customer;

import com.crm.communication.CommunicationRepository;
import com.crm.contact.Contact;
import com.crm.contact.ContactRepository;
import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.deal.DealStage;
import com.crm.security.TenantContext;
import com.crm.task.Task;
import com.crm.task.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final CommunicationRepository communicationRepository;
    private final ContactRepository contactRepository;
    private final TaskRepository taskRepository;

    public CustomerService(CustomerRepository customerRepository,
                           DealRepository dealRepository,
                           CommunicationRepository communicationRepository,
                           ContactRepository contactRepository,
                           TaskRepository taskRepository) {
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.communicationRepository = communicationRepository;
        this.contactRepository = contactRepository;
        this.taskRepository = taskRepository;
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
     * Consolidates customer profile, strictly isolated active deals, communications timeline,
     * associated contacts, related tasks, and health metrics into one unified payload.
     */
    public Map<String, Object> getCustomer360(String id) {
        Customer customer = getCustomerById(id);
        String orgId = TenantContext.getCurrentTenant();
        String companyId = customer.getCompany() != null ? customer.getCompany().getId() : null;

        // Strictly isolated deals belonging to this customer or their corporate account
        List<Deal> deals = dealRepository.findByCustomerOrCompany(orgId, id, companyId);

        // Associated corporate contacts
        List<Contact> contacts = (companyId != null)
                ? contactRepository.findByCompanyIdAndOrganizationId(orgId, companyId)
                : Collections.emptyList();

        // Associated tasks
        List<Task> tasks = taskRepository.findByRelatedEntity(orgId, "CUSTOMER", id);

        // Communications timeline
        var communications = communicationRepository.findAllByOrganizationIdAndCustomerIdOrderByCreatedAtDesc(orgId, id);

        // Calculate dynamic pipeline metrics
        BigDecimal activePipelineValue = deals.stream()
                .filter(d -> d.getStage() != DealStage.LOST)
                .map(Deal::getValue)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeDealsCount = deals.stream()
                .filter(d -> d.getStage() != DealStage.WON && d.getStage() != DealStage.LOST)
                .count();

        Map<String, Object> c360 = new HashMap<>();
        c360.put("customer", customer);
        c360.put("deals", deals);
        c360.put("contacts", contacts);
        c360.put("tasks", tasks);
        c360.put("communications", communications);
        c360.put("metrics", Map.of(
                "activeDealsCount", activeDealsCount,
                "activePipelineValue", activePipelineValue,
                "totalDealsCount", deals.size()
        ));
        c360.put("healthSummary", Map.of(
                "healthScore", customer.getHealthScore() != null ? customer.getHealthScore() : 85,
                "tier", customer.getTier() != null ? customer.getTier() : "STANDARD",
                "churnProbability", customer.getChurnProbability() != null ? customer.getChurnProbability() : BigDecimal.ZERO,
                "lifetimeValue", customer.getLifetimeValue() != null ? customer.getLifetimeValue() : BigDecimal.ZERO,
                "annualRecurringRevenue", customer.getAnnualRecurringRevenue() != null ? customer.getAnnualRecurringRevenue() : BigDecimal.ZERO
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
