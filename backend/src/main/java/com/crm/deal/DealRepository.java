package com.crm.deal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DealRepository extends JpaRepository<Deal, String> {

    @Query("SELECT d FROM Deal d WHERE d.organization.id = :orgId")
    List<Deal> findAllByOrganizationId(@Param("orgId") String orgId);

    @Query("SELECT d FROM Deal d WHERE d.organization.id = :orgId")
    Page<Deal> findByOrganizationId(@Param("orgId") String orgId, Pageable pageable);

    @Query("SELECT d FROM Deal d WHERE d.id = :id AND d.organization.id = :orgId")
    Optional<Deal> findByIdAndOrganizationId(@Param("id") String id, @Param("orgId") String orgId);

    @Query("SELECT SUM(d.value) FROM Deal d WHERE d.organization.id = :orgId AND d.stage = 'WON'")
    BigDecimal sumTotalRevenueByOrganizationId(@Param("orgId") String orgId);
}
