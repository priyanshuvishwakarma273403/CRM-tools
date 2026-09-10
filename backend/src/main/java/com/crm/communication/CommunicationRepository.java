package com.crm.communication;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationRepository extends JpaRepository<CommunicationLog, String> {
    Page<CommunicationLog> findAllByOrganizationIdOrderByCreatedAtDesc(String organizationId, Pageable pageable);
    List<CommunicationLog> findAllByOrganizationIdAndCustomerIdOrderByCreatedAtDesc(String organizationId, String customerId);
    List<CommunicationLog> findAllByOrganizationIdAndLeadIdOrderByCreatedAtDesc(String organizationId, String leadId);
}
