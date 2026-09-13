package com.crm.search;

import com.crm.customer.Customer;
import com.crm.customer.CustomerRepository;
import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.deal.DealStage;
import com.crm.lead.Lead;
import com.crm.lead.LeadRepository;
import com.crm.lead.LeadStatus;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class GlobalSearchTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtProvider jwtProvider;

    private Organization org;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Search Test Org")
                    .domain("searchtest.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("search-user", "user@searchtest.com", org.getId(), "ADMIN");
    }

    @Test
    void testDatabaseIndexedMultiEntitySearch() throws Exception {
        String uniqueKeyword = "Quantum" + System.currentTimeMillis();

        // 1. Create Lead with keyword
        Lead lead = Lead.builder()
                .organization(org)
                .firstName("Elena")
                .lastName("Rostova")
                .companyName(uniqueKeyword + " Aerospace")
                .email("elena@" + uniqueKeyword.toLowerCase() + ".com")
                .status(LeadStatus.NEW)
                .build();
        leadRepository.save(lead);

        // 2. Create Deal with keyword
        Deal deal = Deal.builder()
                .organization(org)
                .title(uniqueKeyword + " Propulsion Modernization")
                .value(new BigDecimal("350000.00"))
                .stage(DealStage.QUALIFIED)
                .build();
        dealRepository.save(deal);

        // 3. Create Customer with keyword
        Customer customer = Customer.builder()
                .organizationId(org.getId())
                .name(uniqueKeyword + " Defense Systems")
                .tier("ENTERPRISE")
                .build();
        customerRepository.save(customer);

        // 4. Perform Global Search for unique keyword across all entities
        mockMvc.perform(get("/api/v1/search?q=" + uniqueKeyword)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.query").value(uniqueKeyword))
                .andExpect(jsonPath("$.data.items", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$.data.leads", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.deals", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.customers", hasSize(greaterThanOrEqualTo(1))));

        // 5. Test Type Filtering: Only return leads and customers
        mockMvc.perform(get("/api/v1/search?q=" + uniqueKeyword + "&types=leads,customers")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.leads", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.customers", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.deals", hasSize(0)));
    }
}
