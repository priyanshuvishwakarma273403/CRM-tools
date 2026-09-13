package com.crm.contact;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, String> {

    @Query("SELECT c FROM Contact c WHERE c.organization.id = :orgId")
    Page<Contact> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT c FROM Contact c WHERE c.organization.id = :orgId")
    List<Contact> findAllByOrganizationId(@Param("orgId") String orgId);

    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.organization.id = :orgId")
    Optional<Contact> findByIdAndOrganizationId(@Param("id") String id, @Param("orgId") String orgId);

    @Query("SELECT c FROM Contact c WHERE c.organization.id = :orgId AND c.company.id = :companyId")
    List<Contact> findByCompanyIdAndOrganizationId(@Param("orgId") String orgId, @Param("companyId") String companyId);

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.organization.id = :orgId")
    long countByOrganizationId(@Param("orgId") String orgId);
}
