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

    @Query("SELECT c FROM Company c WHERE c.organization.id = :orgId AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR (c.website IS NOT NULL AND LOWER(c.website) LIKE LOWER(CONCAT('%', :query, '%'))))")
    List<Company> searchCompanies(@Param("orgId") String orgId, @Param("query") String query, Pageable pageable);
}
