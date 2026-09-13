package com.crm.pipeline;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealStageHistoryRepository extends JpaRepository<DealStageHistory, String> {

    List<DealStageHistory> findByDealIdOrderByCreatedAtDesc(String dealId);

    List<DealStageHistory> findByOrganizationIdAndDealIdOrderByCreatedAtAsc(String organizationId, String dealId);

    List<DealStageHistory> findByOrganizationIdOrderByCreatedAtDesc(String organizationId);
}
