package com.crm.invoice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    @Query("SELECT i FROM Invoice i WHERE i.organization.id = :orgId")
    Page<Invoice> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);
}
