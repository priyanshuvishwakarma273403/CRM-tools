package com.crm.company;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final OrganizationRepository organizationRepository;

    public CompanyService(CompanyRepository companyRepository, OrganizationRepository organizationRepository) {
        this.companyRepository = companyRepository;
        this.organizationRepository = organizationRepository;
    }

    public Page<Company> getCompanies(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return companyRepository.findByOrganizationId(orgId, pageable);
    }

    public Company getCompanyById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return companyRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    @Transactional
    public Company createCompany(Company company) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        company.setOrganization(org);
        return companyRepository.save(company);
    }

    @Transactional
    public Company updateCompany(String id, Company details) {
        Company existing = getCompanyById(id);
        existing.setName(details.getName());
        existing.setIndustry(details.getIndustry());
        existing.setWebsite(details.getWebsite());
        existing.setPhone(details.getPhone());
        existing.setEmail(details.getEmail());
        existing.setAddress(details.getAddress());
        existing.setCity(details.getCity());
        existing.setCountry(details.getCountry());
        return companyRepository.save(existing);
    }

    @Transactional
    public void deleteCompany(String id) {
        Company existing = getCompanyById(id);
        companyRepository.delete(existing);
    }
}
