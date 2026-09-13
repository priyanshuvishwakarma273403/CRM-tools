package com.crm.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Page<Customer> findAllByOrganizationId(String organizationId, Pageable pageable);
    List<Customer> findAllByOrganizationId(String organizationId);
    Optional<Customer> findFirstByOrganizationIdAndPrimaryContactId(String organizationId, String primaryContactId);
    Optional<Customer> findFirstByOrganizationIdAndCompanyId(String organizationId, String companyId);
    Optional<Customer> findByIdAndOrganizationId(String id, String organizationId);
    long countByOrganizationId(String organizationId);

    @Query("SELECT c FROM Customer c WHERE c.organizationId = :orgId AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR (c.industry IS NOT NULL AND LOWER(c.industry) LIKE LOWER(CONCAT('%', :query, '%'))))")
    List<Customer> searchCustomers(@Param("orgId") String orgId, @Param("query") String query, Pageable pageable);
}
