package com.crm.company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, String> {

    @Query("SELECT c FROM Company c WHERE c.organization.id = :orgId")
    Page<Company> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT c FROM Company c WHERE c.organization.id = :orgId")
    List<Company> findAllByOrganizationId(@Param("orgId") String orgId);

    @Query("SELECT c FROM Company c WHERE c.id = :id AND c.organization.id = :orgId")
    Optional<Company> findByIdAndOrganizationId(@Param("id") String id, @Param("orgId") String orgId);

    @Query("SELECT c FROM Company c WHERE LOWER(c.name) = LOWER(:name) AND c.organization.id = :orgId")
    Optional<Company> findByNameIgnoreCaseAndOrganizationId(@Param("name") String name, @Param("orgId") String orgId);

    @Query("SELECT COUNT(c) FROM Company c WHERE c.organization.id = :orgId")
    long countByOrganizationId(@Param("orgId") String orgId);
}
