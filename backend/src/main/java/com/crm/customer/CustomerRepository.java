package com.crm.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Page<Customer> findAllByOrganizationId(String organizationId, Pageable pageable);
    Optional<Customer> findByIdAndOrganizationId(String id, String organizationId);
    long countByOrganizationId(String organizationId);
}
