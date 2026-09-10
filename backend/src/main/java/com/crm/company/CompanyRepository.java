package com.crm.company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, String> {

    @Query("SELECT c FROM Company c WHERE c.organization.id = :orgId")
    Page<Company> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT c FROM Company c WHERE c.id = :id AND c.organization.id = :orgId")
    Optional<Company> findByIdAndOrganizationId(@Param("id") String id, @Param("orgId") String orgId);
}
