package com.crm.pipeline;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PipelineStageRepository extends JpaRepository<PipelineStage, String> {

    List<PipelineStage> findByPipelineIdOrderByOrderIndexAsc(String pipelineId);

    List<PipelineStage> findByOrganizationIdAndPipelineIdOrderByOrderIndexAsc(String organizationId, String pipelineId);

    Optional<PipelineStage> findByIdAndOrganizationId(String id, String organizationId);

    Optional<PipelineStage> findByPipelineIdAndCode(String pipelineId, String code);
}
