package com.crm.search;

import com.crm.company.Company;
import com.crm.company.CompanyRepository;
import com.crm.contact.Contact;
import com.crm.contact.ContactRepository;
import com.crm.customer.Customer;
import com.crm.customer.CustomerRepository;
import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.lead.Lead;
import com.crm.lead.LeadRepository;
import com.crm.security.TenantContext;
import com.crm.support.Ticket;
import com.crm.support.TicketRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GlobalSearchService {

    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final TicketRepository ticketRepository;

    public GlobalSearchService(LeadRepository leadRepository,
                               DealRepository dealRepository,
                               ContactRepository contactRepository,
                               CompanyRepository companyRepository,
                               CustomerRepository customerRepository,
                               TicketRepository ticketRepository) {
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.customerRepository = customerRepository;
        this.ticketRepository = ticketRepository;
    }

    public Map<String, Object> executeSearch(String query, String typesFilter, int limit) {
        String orgId = TenantContext.getCurrentTenant();
        int maxLimit = Math.max(1, Math.min(limit, 50));
        PageRequest pageRequest = PageRequest.of(0, maxLimit);

        Set<String> types = parseTypes(typesFilter);

        List<Lead> leads = Collections.emptyList();
        List<Deal> deals = Collections.emptyList();
        List<Contact> contacts = Collections.emptyList();
        List<Company> companies = Collections.emptyList();
        List<Customer> customers = Collections.emptyList();
        List<Ticket> tickets = Collections.emptyList();

        List<SearchResultItem> unifiedResults = new ArrayList<>();

        if (types.contains("LEADS") || types.contains("ALL")) {
            leads = leadRepository.searchLeads(orgId, query, pageRequest);
            for (Lead lead : leads) {
                unifiedResults.add(SearchResultItem.builder()
                        .id(lead.getId())
                        .type("LEAD")
                        .title(lead.getFirstName() + " " + (lead.getLastName() != null ? lead.getLastName() : ""))
                        .subtitle(lead.getCompanyName() != null ? lead.getCompanyName() : lead.getEmail())
                        .status(lead.getStatus() != null ? lead.getStatus().name() : null)
                        .url("/leads/" + lead.getId())
                        .build());
            }
        }

        if (types.contains("DEALS") || types.contains("ALL")) {
            deals = dealRepository.searchDeals(orgId, query, pageRequest);
            for (Deal deal : deals) {
                unifiedResults.add(SearchResultItem.builder()
                        .id(deal.getId())
                        .type("DEAL")
                        .title(deal.getTitle())
                        .subtitle(deal.getValue() != null ? deal.getCurrency() + " " + deal.getValue() : null)
                        .status(deal.getStage() != null ? deal.getStage().name() : null)
                        .url("/deals/" + deal.getId())
                        .build());
            }
        }

        if (types.contains("CONTACTS") || types.contains("ALL")) {
            contacts = contactRepository.searchContacts(orgId, query, pageRequest);
            for (Contact contact : contacts) {
                unifiedResults.add(SearchResultItem.builder()
                        .id(contact.getId())
                        .type("CONTACT")
                        .title(contact.getFirstName() + " " + (contact.getLastName() != null ? contact.getLastName() : ""))
                        .subtitle(contact.getEmail() != null ? contact.getEmail() : contact.getPhone())
                        .url("/contacts/" + contact.getId())
                        .build());
            }
        }

        if (types.contains("COMPANIES") || types.contains("ALL")) {
            companies = companyRepository.searchCompanies(orgId, query, pageRequest);
            for (Company company : companies) {
                unifiedResults.add(SearchResultItem.builder()
                        .id(company.getId())
                        .type("COMPANY")
                        .title(company.getName())
                        .subtitle(company.getWebsite() != null ? company.getWebsite() : company.getIndustry())
                        .url("/companies/" + company.getId())
                        .build());
            }
        }

        if (types.contains("CUSTOMERS") || types.contains("ALL")) {
            customers = customerRepository.searchCustomers(orgId, query, pageRequest);
            for (Customer customer : customers) {
                unifiedResults.add(SearchResultItem.builder()
                        .id(customer.getId())
                        .type("CUSTOMER")
                        .title(customer.getName())
                        .subtitle(customer.getTier() + " · Health: " + customer.getHealthScore())
                        .status(customer.getStatus())
                        .url("/customers/" + customer.getId())
                        .build());
            }
        }

        if (types.contains("TICKETS") || types.contains("ALL")) {
            tickets = ticketRepository.searchTickets(orgId, query, pageRequest);
            for (Ticket ticket : tickets) {
                unifiedResults.add(SearchResultItem.builder()
                        .id(ticket.getId())
                        .type("TICKET")
                        .title(ticket.getTicketNumber() + ": " + ticket.getSubject())
                        .subtitle("Priority: " + ticket.getPriority())
                        .status(ticket.getStatus() != null ? ticket.getStatus().name() : null)
                        .url("/tickets/" + ticket.getId())
                        .build());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("query", query);
        response.put("totalMatches", unifiedResults.size());
        response.put("items", unifiedResults);
        // Preserved backward compatibility keys for web, desktop, and mobile clients
        response.put("leads", leads);
        response.put("deals", deals);
        response.put("contacts", contacts);
        response.put("companies", companies);
        response.put("customers", customers);
        response.put("tickets", tickets);

        return response;
    }

    private Set<String> parseTypes(String typesFilter) {
        if (typesFilter == null || typesFilter.isBlank() || "all".equalsIgnoreCase(typesFilter.trim())) {
            return Set.of("ALL");
        }
        Set<String> set = new HashSet<>();
        for (String part : typesFilter.split(",")) {
            set.add(part.trim().toUpperCase());
        }
        return set;
    }
}
