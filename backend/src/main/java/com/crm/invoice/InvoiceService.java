package com.crm.invoice;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrganizationRepository organizationRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, OrganizationRepository organizationRepository) {
        this.invoiceRepository = invoiceRepository;
        this.organizationRepository = organizationRepository;
    }

    public Page<Invoice> getInvoices(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return invoiceRepository.findByOrganizationId(orgId, pageable);
    }

    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        invoice.setOrganization(org);
        return invoiceRepository.save(invoice);
    }
}
