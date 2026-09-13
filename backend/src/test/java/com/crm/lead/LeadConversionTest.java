package com.crm.lead;

import com.crm.company.CompanyRepository;
import com.crm.contact.ContactRepository;
import com.crm.customer.CustomerRepository;
import com.crm.deal.DealRepository;
import com.crm.lead.dto.LeadConversionRequest;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class LeadConversionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private LeadConversionRepository leadConversionRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private Organization org;
    private String token;

    @BeforeEach
    void setUp() {
        org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("Test Lead Conversion Org")
                    .domain("leadconversion.com")
                    .build();
            return organizationRepository.save(newOrg);
        });
        token = "Bearer " + jwtProvider.generateAccessToken("test-admin", "admin@leadconversion.com", org.getId(), "ADMIN");
    }

    @Test
    void testEnterpriseLeadConversionWithCompanyDealAndCustomer() throws Exception {
        // 1. Create a qualified Lead
        Lead lead = Lead.builder()
                .organization(org)
                .firstName("Sophia")
                .lastName("Sterling")
                .companyName("Nexus Global Dynamics")
                .email("sophia.sterling@nexusdynamics.io")
                .phone("+1-555-987-6543")
                .status(LeadStatus.QUALIFIED)
                .score(88)
                .source(LeadSource.WEBSITE)
                .build();
        lead = leadRepository.save(lead);

        // 2. Perform Enterprise Conversion
        LeadConversionRequest request = LeadConversionRequest.builder()
                .createCompany(true)
                .companyName("Nexus Global Dynamics")
                .createCustomer(true)
                .createDeal(true)
                .dealTitle("Nexus Enterprise Expansion License")
                .dealValue(new BigDecimal("125000.00"))
                .build();

        mockMvc.perform(post("/api/v1/leads/" + lead.getId() + "/convert")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.leadId").value(lead.getId()))
                .andExpect(jsonPath("$.data.companyName").value("Nexus Global Dynamics"))
                .andExpect(jsonPath("$.data.contactName").value("Sophia Sterling"))
                .andExpect(jsonPath("$.data.customerName").value("Nexus Global Dynamics"))
                .andExpect(jsonPath("$.data.dealTitle").value("Nexus Enterprise Expansion License"))
                .andExpect(jsonPath("$.data.convertedAt").isNotEmpty());

        // 3. Verify Lead status is CONVERTED
        Lead updatedLead = leadRepository.findById(lead.getId()).orElseThrow();
        assert updatedLead.getStatus() == LeadStatus.CONVERTED;

        // 4. Verify conversion record saved in database
        assert leadConversionRepository.findByOrganizationIdAndLeadId(org.getId(), lead.getId()).isPresent();
    }

    @Test
    void testBackwardCompatibleLeadConversion() throws Exception {
        // 1. Create simple Lead
        Lead lead = Lead.builder()
                .organization(org)
                .firstName("Alexander")
                .lastName("Vance")
                .companyName("Vance Analytics")
                .email("alexander@vanceanalytics.com")
                .phone("+1-555-333-2211")
                .status(LeadStatus.NEW)
                .score(60)
                .build();
        lead = leadRepository.save(lead);

        // 2. Call conversion with empty body (legacy API pattern)
        mockMvc.perform(post("/api/v1/leads/" + lead.getId() + "/convert")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(lead.getId()))
                .andExpect(jsonPath("$.data.status").value("CONVERTED"));

        Lead converted = leadRepository.findById(lead.getId()).orElseThrow();
        assert converted.getStatus() == LeadStatus.CONVERTED;
    }
}
