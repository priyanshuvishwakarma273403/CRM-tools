package com.crm.lead;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, String> {

    @Query("SELECT l FROM Lead l WHERE l.organization.id = :orgId AND l.deletedAt IS NULL")
    Page<Lead> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT l FROM Lead l WHERE l.id = :id AND l.organization.id = :orgId AND l.deletedAt IS NULL")
    Optional<Lead> findByIdAndOrganizationId(@Param("id") String id, @Param("orgId") String orgId);

    @Query("SELECT l FROM Lead l WHERE l.organization.id = :orgId AND l.deletedAt IS NULL")
    List<Lead> findAllByOrganizationId(@Param("orgId") String orgId);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.organization.id = :orgId AND l.deletedAt IS NULL")
    long countByOrganizationId(@Param("orgId") String orgId);

    @Query("SELECT l FROM Lead l WHERE l.organization.id = :orgId AND l.deletedAt IS NULL AND (LOWER(l.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Lead> searchLeads(@Param("orgId") String orgId, @Param("query") String query, Pageable pageable);

    Optional<Lead> findFirstByOrganizationIdAndEmailIgnoreCaseAndDeletedAtIsNull(String orgId, String email);

    Optional<Lead> findFirstByOrganizationIdAndPhoneAndDeletedAtIsNull(String orgId, String phone);
}
