package com.crm.customer;

import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.deal.DealStage;
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
public class Customer360IsolationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private JwtProvider jwtProvider;

    private Organization org;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Customer 360 Isolation Org")
                    .domain("c360test.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("c360-admin", "admin@c360test.com", org.getId(), "ADMIN");
    }

    @Test
    void testCustomer360StrictDataIsolationBetweenCustomers() throws Exception {
        // 1. Create Customer Alpha
        Customer custAlpha = Customer.builder()
                .organizationId(org.getId())
                .name("Alpha Industrial Systems")
                .tier("ENTERPRISE")
                .healthScore(95)
                .build();
        custAlpha = customerRepository.save(custAlpha);

        // 2. Create Customer Beta
        Customer custBeta = Customer.builder()
                .organizationId(org.getId())
                .name("Beta Logistics Corp")
                .tier("GROWTH")
                .healthScore(70)
                .build();
        custBeta = customerRepository.save(custBeta);

        // 3. Create Deal specifically for Customer Alpha
        Deal dealAlpha = Deal.builder()
                .organization(org)
                .customerId(custAlpha.getId())
                .title("Alpha SCADA Upgrade Contract")
                .value(new BigDecimal("80000.00"))
                .stage(DealStage.QUALIFIED)
                .build();
        dealRepository.save(dealAlpha);

        // 4. Create Deal specifically for Customer Beta
        Deal dealBeta = Deal.builder()
                .organization(org)
                .customerId(custBeta.getId())
                .title("Beta Fleet Tracking System")
                .value(new BigDecimal("45000.00"))
                .stage(DealStage.PROPOSAL)
                .build();
        dealRepository.save(dealBeta);

        // 5. Query Customer 360 for Alpha:
        // Must contain Alpha SCADA Upgrade Contract, and MUST NOT leak Beta Fleet Tracking System!
        mockMvc.perform(get("/api/v1/customers/" + custAlpha.getId() + "/360")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.customer.id").value(custAlpha.getId()))
                .andExpect(jsonPath("$.data.customer.name").value("Alpha Industrial Systems"))
                .andExpect(jsonPath("$.data.deals", hasSize(1)))
                .andExpect(jsonPath("$.data.deals[0].title").value("Alpha SCADA Upgrade Contract"))
                .andExpect(jsonPath("$.data.deals[*].title", not(hasItem("Beta Fleet Tracking System"))))
                .andExpect(jsonPath("$.data.metrics.totalDealsCount").value(1))
                .andExpect(jsonPath("$.data.healthSummary.healthScore").value(95));
    }
}
