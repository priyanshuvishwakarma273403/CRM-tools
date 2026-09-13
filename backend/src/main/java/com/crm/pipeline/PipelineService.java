package com.crm.pipeline;

import com.crm.common.exception.BadRequestException;
import com.crm.common.exception.ResourceNotFoundException;
import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.pipeline.dto.*;
import com.crm.security.TenantContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PipelineService {

    private final PipelineRepository pipelineRepository;
    private final PipelineStageRepository pipelineStageRepository;
    private final DealRepository dealRepository;

    public PipelineService(PipelineRepository pipelineRepository,
                           PipelineStageRepository pipelineStageRepository,
                           DealRepository dealRepository) {
        this.pipelineRepository = pipelineRepository;
        this.pipelineStageRepository = pipelineStageRepository;
        this.dealRepository = dealRepository;
    }

    @Transactional
    public List<PipelineResponse> getPipelines() {
        String orgId = TenantContext.getCurrentTenant();
        List<Pipeline> pipelines = pipelineRepository.findAllByOrganizationId(orgId);
        if (pipelines.isEmpty()) {
            Pipeline defaultPipe = createDefaultPipelineForOrg(orgId);
            pipelines = List.of(defaultPipe);
        }

        List<Deal> allOrgDeals = dealRepository.findAllByOrganizationId(orgId);
        return pipelines.stream()
                .map(p -> toPipelineResponse(p, allOrgDeals))
                .collect(Collectors.toList());
    }

    @Transactional
    public PipelineResponse getPipelineById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        Pipeline pipeline = pipelineRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found with id: " + id));
        List<Deal> deals = dealRepository.findByOrganizationIdAndPipelineId(orgId, id);
        return toPipelineResponse(pipeline, deals);
    }

    @Transactional
    public PipelineResponse getDefaultPipeline() {
        String orgId = TenantContext.getCurrentTenant();
        Pipeline pipeline = pipelineRepository.findByOrganizationIdAndIsDefaultTrue(orgId)
                .orElseGet(() -> {
                    List<Pipeline> existing = pipelineRepository.findAllByOrganizationId(orgId);
                    if (!existing.isEmpty()) {
                        Pipeline first = existing.get(0);
                        first.setIsDefault(true);
                        return pipelineRepository.save(first);
                    }
                    return createDefaultPipelineForOrg(orgId);
                });
        List<Deal> deals = dealRepository.findByOrganizationIdAndPipelineId(orgId, pipeline.getId());
        return toPipelineResponse(pipeline, deals);
    }

    @Transactional
    public PipelineResponse createPipeline(CreatePipelineRequest request) {
        String orgId = TenantContext.getCurrentTenant();

        boolean makeDefault = Boolean.TRUE.equals(request.getIsDefault());
        if (makeDefault) {
            unsetDefaultPipelines(orgId);
        }

        Pipeline pipeline = Pipeline.builder()
                .organizationId(orgId)
                .name(request.getName())
                .isDefault(makeDefault)
                .build();

        Pipeline savedPipeline = pipelineRepository.save(pipeline);

        List<PipelineStage> stages = new ArrayList<>();
        if (request.getStages() != null && !request.getStages().isEmpty()) {
            int order = 1;
            for (CreateStageRequest sr : request.getStages()) {
                PipelineStage stage = PipelineStage.builder()
                        .organizationId(orgId)
                        .pipeline(savedPipeline)
                        .name(sr.getName())
                        .code(sr.getCode() != null ? sr.getCode().toUpperCase() : "STAGE_" + order)
                        .orderIndex(sr.getOrderIndex() != null ? sr.getOrderIndex() : order++)
                        .winProbability(sr.getWinProbability() != null ? sr.getWinProbability() : 10)
                        .colorCode(sr.getColorCode() != null ? sr.getColorCode() : "#3B82F6")
                        .build();
                stages.add(pipelineStageRepository.save(stage));
            }
        } else {
            stages = createStandardStages(orgId, savedPipeline);
        }

        savedPipeline.setStages(stages);
        return toPipelineResponse(savedPipeline, Collections.emptyList());
    }

    @Transactional
    public PipelineResponse updatePipeline(String id, UpdatePipelineRequest request) {
        String orgId = TenantContext.getCurrentTenant();
        Pipeline pipeline = pipelineRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            pipeline.setName(request.getName());
        }

        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(pipeline.getIsDefault())) {
            unsetDefaultPipelines(orgId);
            pipeline.setIsDefault(true);
        }

        Pipeline saved = pipelineRepository.save(pipeline);
        List<Deal> deals = dealRepository.findByOrganizationIdAndPipelineId(orgId, id);
        return toPipelineResponse(saved, deals);
    }

    @Transactional
    public void deletePipeline(String id) {
        String orgId = TenantContext.getCurrentTenant();
        Pipeline pipeline = pipelineRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found with id: " + id));

        if (Boolean.TRUE.equals(pipeline.getIsDefault())) {
            long totalPipelines = pipelineRepository.findAllByOrganizationId(orgId).size();
            if (totalPipelines <= 1) {
                throw new BadRequestException("Cannot delete the default pipeline when it is the only pipeline.");
            }
        }

        List<Deal> activeDeals = dealRepository.findByOrganizationIdAndPipelineId(orgId, id);
        if (!activeDeals.isEmpty()) {
            throw new BadRequestException("Cannot delete pipeline containing " + activeDeals.size() + " active deals. Please reassign deals first.");
        }

        pipelineRepository.delete(pipeline);
    }

    @Transactional
    public StageResponse addStage(String pipelineId, CreateStageRequest request) {
        String orgId = TenantContext.getCurrentTenant();
        Pipeline pipeline = pipelineRepository.findByIdAndOrganizationId(pipelineId, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found with id: " + pipelineId));

        List<PipelineStage> existingStages = pipelineStageRepository.findByPipelineIdOrderByOrderIndexAsc(pipelineId);
        int nextOrder = existingStages.isEmpty() ? 1 : existingStages.get(existingStages.size() - 1).getOrderIndex() + 1;

        PipelineStage stage = PipelineStage.builder()
                .organizationId(orgId)
                .pipeline(pipeline)
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : nextOrder)
                .winProbability(request.getWinProbability() != null ? request.getWinProbability() : 10)
                .colorCode(request.getColorCode() != null ? request.getColorCode() : "#3B82F6")
                .build();

        PipelineStage saved = pipelineStageRepository.save(stage);
        return toStageResponse(saved, Collections.emptyList());
    }

    @Transactional
    public StageResponse updateStage(String pipelineId, String stageId, UpdateStageRequest request) {
        String orgId = TenantContext.getCurrentTenant();
        PipelineStage stage = pipelineStageRepository.findByIdAndOrganizationId(stageId, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Stage not found with id: " + stageId));

        if (!stage.getPipeline().getId().equals(pipelineId)) {
            throw new BadRequestException("Stage does not belong to pipeline: " + pipelineId);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            stage.setName(request.getName());
        }
        if (request.getCode() != null && !request.getCode().isBlank()) {
            stage.setCode(request.getCode().toUpperCase());
        }
        if (request.getOrderIndex() != null) {
            stage.setOrderIndex(request.getOrderIndex());
        }
        if (request.getWinProbability() != null) {
            stage.setWinProbability(request.getWinProbability());
        }
        if (request.getColorCode() != null && !request.getColorCode().isBlank()) {
            stage.setColorCode(request.getColorCode());
        }

        PipelineStage saved = pipelineStageRepository.save(stage);
        List<Deal> deals = dealRepository.findAllByOrganizationId(orgId);
        return toStageResponse(saved, deals);
    }

    @Transactional
    public void deleteStage(String pipelineId, String stageId) {
        String orgId = TenantContext.getCurrentTenant();
        PipelineStage stage = pipelineStageRepository.findByIdAndOrganizationId(stageId, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Stage not found with id: " + stageId));

        if (!stage.getPipeline().getId().equals(pipelineId)) {
            throw new BadRequestException("Stage does not belong to pipeline: " + pipelineId);
        }

        pipelineStageRepository.delete(stage);
    }

    @Transactional
    public List<StageResponse> reorderStages(String pipelineId, List<String> stageIds) {
        String orgId = TenantContext.getCurrentTenant();
        Pipeline pipeline = pipelineRepository.findByIdAndOrganizationId(pipelineId, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found with id: " + pipelineId));

        List<PipelineStage> stages = pipelineStageRepository.findByPipelineIdOrderByOrderIndexAsc(pipelineId);
        Map<String, PipelineStage> stageMap = stages.stream()
                .collect(Collectors.toMap(PipelineStage::getId, s -> s));

        int order = 1;
        for (String id : stageIds) {
            PipelineStage stage = stageMap.get(id);
            if (stage != null) {
                stage.setOrderIndex(order++);
                pipelineStageRepository.save(stage);
            }
        }

        List<Deal> deals = dealRepository.findAllByOrganizationId(orgId);
        return pipelineStageRepository.findByPipelineIdOrderByOrderIndexAsc(pipelineId).stream()
                .map(s -> toStageResponse(s, deals))
                .collect(Collectors.toList());
    }

    private void unsetDefaultPipelines(String orgId) {
        pipelineRepository.findByOrganizationIdAndIsDefaultTrue(orgId).ifPresent(p -> {
            p.setIsDefault(false);
            pipelineRepository.save(p);
        });
    }

    private Pipeline createDefaultPipelineForOrg(String orgId) {
        Pipeline pipeline = Pipeline.builder()
                .organizationId(orgId)
                .name("Standard Sales Pipeline")
                .isDefault(true)
                .build();
        Pipeline saved = pipelineRepository.save(pipeline);
        List<PipelineStage> stages = createStandardStages(orgId, saved);
        saved.setStages(stages);
        return saved;
    }

    private List<PipelineStage> createStandardStages(String orgId, Pipeline pipeline) {
        List<PipelineStage> stages = List.of(
                PipelineStage.builder().organizationId(orgId).pipeline(pipeline).name("New Lead").code("NEW").orderIndex(1).winProbability(10).colorCode("#3B82F6").build(),
                PipelineStage.builder().organizationId(orgId).pipeline(pipeline).name("Qualified").code("QUALIFIED").orderIndex(2).winProbability(25).colorCode("#10B981").build(),
                PipelineStage.builder().organizationId(orgId).pipeline(pipeline).name("Product Demo").code("DEMO").orderIndex(3).winProbability(50).colorCode("#8B5CF6").build(),
                PipelineStage.builder().organizationId(orgId).pipeline(pipeline).name("Proposal Sent").code("PROPOSAL").orderIndex(4).winProbability(70).colorCode("#F59E0B").build(),
                PipelineStage.builder().organizationId(orgId).pipeline(pipeline).name("Negotiation").code("NEGOTIATION").orderIndex(5).winProbability(85).colorCode("#6366F1").build(),
                PipelineStage.builder().organizationId(orgId).pipeline(pipeline).name("Closed Won").code("WON").orderIndex(6).winProbability(100).colorCode("#059669").build(),
                PipelineStage.builder().organizationId(orgId).pipeline(pipeline).name("Closed Lost").code("LOST").orderIndex(7).winProbability(0).colorCode("#EF4444").build()
        );
        return pipelineStageRepository.saveAll(stages);
    }

    private PipelineResponse toPipelineResponse(Pipeline pipeline, List<Deal> orgOrPipelineDeals) {
        List<PipelineStage> stages = pipeline.getStages() != null && !pipeline.getStages().isEmpty()
                ? pipeline.getStages()
                : pipelineStageRepository.findByPipelineIdOrderByOrderIndexAsc(pipeline.getId());

        List<Deal> pipelineDeals = orgOrPipelineDeals.stream()
                .filter(d -> pipeline.getId().equals(d.getPipelineId()) || (pipeline.getIsDefault() && d.getPipelineId() == null))
                .collect(Collectors.toList());

        List<StageResponse> stageResponses = stages.stream()
                .map(s -> toStageResponse(s, pipelineDeals))
                .collect(Collectors.toList());

        BigDecimal totalVal = pipelineDeals.stream()
                .map(Deal::getValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return PipelineResponse.builder()
                .id(pipeline.getId())
                .organizationId(pipeline.getOrganizationId())
                .name(pipeline.getName())
                .isDefault(pipeline.getIsDefault())
                .stages(stageResponses)
                .totalDeals(pipelineDeals.size())
                .totalValue(totalVal)
                .createdAt(pipeline.getCreatedAt())
                .build();
    }

    private StageResponse toStageResponse(PipelineStage stage, List<Deal> deals) {
        List<Deal> matchingDeals = deals.stream()
                .filter(d -> stage.getId().equals(d.getStageId()) || (d.getStage() != null && d.getStage().name().equalsIgnoreCase(stage.getCode())))
                .collect(Collectors.toList());

        BigDecimal val = matchingDeals.stream()
                .map(Deal::getValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return StageResponse.builder()
                .id(stage.getId())
                .name(stage.getName())
                .code(stage.getCode())
                .orderIndex(stage.getOrderIndex())
                .winProbability(stage.getWinProbability())
                .colorCode(stage.getColorCode())
                .dealCount(matchingDeals.size())
                .totalValue(val)
                .createdAt(stage.getCreatedAt())
                .build();
    }
}
