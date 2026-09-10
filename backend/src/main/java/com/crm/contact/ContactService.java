package com.crm.contact;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final OrganizationRepository organizationRepository;

    public ContactService(ContactRepository contactRepository, OrganizationRepository organizationRepository) {
        this.contactRepository = contactRepository;
        this.organizationRepository = organizationRepository;
    }

    public Page<Contact> getContacts(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return contactRepository.findByOrganizationId(orgId, pageable);
    }

    public Contact getContactById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return contactRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    @Transactional
    public Contact createContact(Contact contact) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        contact.setOrganization(org);
        return contactRepository.save(contact);
    }

    @Transactional
    public Contact updateContact(String id, Contact details) {
        Contact existing = getContactById(id);
        existing.setFirstName(details.getFirstName());
        existing.setLastName(details.getLastName());
        existing.setEmail(details.getEmail());
        existing.setPhone(details.getPhone());
        existing.setDesignation(details.getDesignation());
        existing.setNotes(details.getNotes());
        return contactRepository.save(existing);
    }

    @Transactional
    public void deleteContact(String id) {
        Contact existing = getContactById(id);
        contactRepository.delete(existing);
    }
}
