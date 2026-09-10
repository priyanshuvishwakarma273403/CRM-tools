package com.crm.contact;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, String> {

    @Query("SELECT c FROM Contact c WHERE c.organization.id = :orgId")
    Page<Contact> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.organization.id = :orgId")
    Optional<Contact> findByIdAndOrganizationId(@Param("id") String id, @Param("orgId") String orgId);
}
