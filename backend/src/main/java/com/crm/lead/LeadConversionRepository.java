package com.crm.lead;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeadConversionRepository extends JpaRepository<LeadConversion, String> {
    Optional<LeadConversion> findByOrganizationIdAndLeadId(String organizationId, String leadId);
    List<LeadConversion> findByOrganizationIdOrderByConvertedAtDesc(String organizationId);
}
