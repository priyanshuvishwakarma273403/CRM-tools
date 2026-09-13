package com.crm.deal;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.deal.dto.PipelineMetricsResponse;
import com.crm.deal.dto.RevenueForecastResponse;
import com.crm.deal.dto.UpdateDealStageRequest;
import com.crm.event.CrmDomainEvent;
import com.crm.event.DomainEventPublisher;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.pipeline.*;
import com.crm.security.TenantContext;
import com.crm.websocket.CrmEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final OrganizationRepository organizationRepository;
    private final CrmEventPublisher eventPublisher;
    private final DomainEventPublisher domainEventPublisher;
    private final PipelineRepository pipelineRepository;
    private final PipelineStageRepository pipelineStageRepository;
    private final DealStageHistoryRepository dealStageHistoryRepository;

    public DealService(DealRepository dealRepository,
                       OrganizationRepository organizationRepository,
                       CrmEventPublisher eventPublisher,
                       DomainEventPublisher domainEventPublisher,
                       PipelineRepository pipelineRepository,
                       PipelineStageRepository pipelineStageRepository,
                       DealStageHistoryRepository dealStageHistoryRepository) {
        this.dealRepository = dealRepository;
        this.organizationRepository = organizationRepository;
        this.eventPublisher = eventPublisher;
        this.domainEventPublisher = domainEventPublisher;
        this.pipelineRepository = pipelineRepository;
        this.pipelineStageRepository = pipelineStageRepository;
        this.dealStageHistoryRepository = dealStageHistoryRepository;
    }

    public List<Deal> getAllDeals() {
        String orgId = TenantContext.getCurrentTenant();
        return dealRepository.findAllByOrganizationId(orgId);
    }

    public Page<Deal> getDeals(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return dealRepository.findByOrganizationId(orgId, pageable);
    }

    public Deal getDealById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return dealRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + id));
    }

    @Transactional
    public Deal createDeal(Deal deal) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        deal.setOrganization(org);

        // Auto-assign default pipeline and stage if not provided
        if (deal.getPipelineId() == null) {
            Pipeline defaultPipeline = pipelineRepository.findByOrganizationIdAndIsDefaultTrue(orgId)
                    .orElseGet(() -> {
                        List<Pipeline> pipes = pipelineRepository.findAllByOrganizationId(orgId);
                        return pipes.isEmpty() ? null : pipes.get(0);
                    });

            if (defaultPipeline != null) {
                deal.setPipelineId(defaultPipeline.getId());
                if (deal.getStageId() == null) {
                    List<PipelineStage> stages = pipelineStageRepository.findByPipelineIdOrderByOrderIndexAsc(defaultPipeline.getId());
                    String targetCode = deal.getStage() != null ? deal.getStage().name() : "NEW";
                    PipelineStage matchingStage = stages.stream()
                            .filter(s -> s.getCode().equalsIgnoreCase(targetCode))
                            .findFirst()
                            .orElse(stages.isEmpty() ? null : stages.get(0));

                    if (matchingStage != null) {
                        deal.setStageId(matchingStage.getId());
                        if (deal.getProbability() == null || deal.getProbability() == 10) {
                            deal.setProbability(matchingStage.getWinProbability());
                        }
                    }
                }
            }
        }

        if (deal.getStageEnteredAt() == null) {
            deal.setStageEnteredAt(LocalDateTime.now());
        }

        Deal saved = dealRepository.save(deal);

        // Record initial stage history entry
        DealStageHistory initialHistory = DealStageHistory.builder()
                .organizationId(orgId)
                .dealId(saved.getId())
                .fromStage(null)
                .toStage(saved.getStage().name())
                .fromStageId(null)
                .toStageId(saved.getStageId())
                .durationDays(0)
                .notes("Deal created in stage " + saved.getStage().name())
                .build();
        dealStageHistoryRepository.save(initialHistory);

        // Publish Domain Event
        Map<String, Object> payload = new HashMap<>();
        payload.put("dealId", saved.getId());
        payload.put("title", saved.getTitle());
        payload.put("value", saved.getValue());
        payload.put("currency", saved.getCurrency());
        payload.put("stage", saved.getStage().name());
        payload.put("pipelineId", saved.getPipelineId());

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("DEAL_CREATED")
                .entityType("DEAL")
                .entityId(saved.getId())
                .payload(payload)
                .build());

        // Publish real-time WebSocket
        eventPublisher.publishEvent("DEAL_CREATED", orgId, saved);
        return saved;
    }

    @Transactional
    public Deal updateDeal(String id, Deal details) {
        Deal existing = getDealById(id);
        existing.setTitle(details.getTitle());
        existing.setValue(details.getValue());
        existing.setProbability(details.getProbability());
        existing.setExpectedCloseDate(details.getExpectedCloseDate());
        if (details.getCurrency() != null) existing.setCurrency(details.getCurrency());
        if (details.getCompany() != null) existing.setCompany(details.getCompany());
        if (details.getContact() != null) existing.setContact(details.getContact());
        if (details.getCustomerId() != null) existing.setCustomerId(details.getCustomerId());
        if (details.getPipelineId() != null) existing.setPipelineId(details.getPipelineId());
        if (details.getStageId() != null) existing.setStageId(details.getStageId());
        if (details.getTags() != null) existing.setTags(details.getTags());
        if (details.getNotes() != null) existing.setNotes(details.getNotes());
        if (details.getWinReason() != null) existing.setWinReason(details.getWinReason());
        if (details.getLossReason() != null) existing.setLossReason(details.getLossReason());

        if (details.getStage() != null && details.getStage() != existing.getStage()) {
            return updateStage(id, UpdateDealStageRequest.builder()
                    .stage(details.getStage().name())
                    .stageId(details.getStageId())
                    .winReason(details.getWinReason())
                    .lossReason(details.getLossReason())
                    .notes("Stage updated via deal update")
                    .build());
        }

        Deal saved = dealRepository.save(existing);
        eventPublisher.publishEvent("DEAL_UPDATED", TenantContext.getCurrentTenant(), saved);
        return saved;
    }

    @Transactional
    public Deal updateStage(String id, DealStage stage) {
        return updateStage(id, UpdateDealStageRequest.builder()
                .stage(stage.name())
                .build());
    }

    @Transactional
    public Deal updateStage(String id, UpdateDealStageRequest request) {
        String orgId = TenantContext.getCurrentTenant();
        Deal existing = getDealById(id);

        String fromStage = existing.getStage() != null ? existing.getStage().name() : "NEW";
        String fromStageId = existing.getStageId();

        // Calculate days spent in previous stage
        LocalDateTime enteredAt = existing.getStageEnteredAt() != null
                ? existing.getStageEnteredAt()
                : (existing.getCreatedAt() != null ? existing.getCreatedAt() : LocalDateTime.now());
        long durationDays = Math.max(0, ChronoUnit.DAYS.between(enteredAt, LocalDateTime.now()));

        // Resolve target stage
        DealStage targetStage = null;
        if (request.getStage() != null) {
            try {
                targetStage = DealStage.valueOf(request.getStage().toUpperCase());
            } catch (IllegalArgumentException e) {
                // If custom stage code doesn't map directly to DealStage enum, map logically
                targetStage = mapCodeToDealStage(request.getStage());
            }
        }

        if (request.getStageId() != null) {
            existing.setStageId(request.getStageId());
            pipelineStageRepository.findByIdAndOrganizationId(request.getStageId(), orgId).ifPresent(s -> {
                if (existing.getStage() == null || existing.getStage() == DealStage.NEW) {
                    existing.setProbability(s.getWinProbability());
                }
            });
        }

        if (targetStage == null) {
            targetStage = DealStage.NEW;
        }

        existing.setStage(targetStage);
        existing.setStageEnteredAt(LocalDateTime.now());

        if (targetStage == DealStage.WON) {
            existing.setProbability(100);
            if (request.getWinReason() != null) {
                existing.setWinReason(request.getWinReason());
            }
        } else if (targetStage == DealStage.LOST) {
            existing.setProbability(0);
            if (request.getLossReason() != null) {
                existing.setLossReason(request.getLossReason());
            }
        }

        Deal saved = dealRepository.save(existing);

        // Record Stage History
        DealStageHistory history = DealStageHistory.builder()
                .organizationId(orgId)
                .dealId(saved.getId())
                .fromStage(fromStage)
                .toStage(targetStage.name())
                .fromStageId(fromStageId)
                .toStageId(saved.getStageId())
                .durationDays((int) durationDays)
                .notes(request.getNotes())
                .build();
        dealStageHistoryRepository.save(history);

        // Publish Domain Events
        Map<String, Object> payload = new HashMap<>();
        payload.put("dealId", saved.getId());
        payload.put("title", saved.getTitle());
        payload.put("value", saved.getValue());
        payload.put("fromStage", fromStage);
        payload.put("toStage", targetStage.name());
        payload.put("durationDays", durationDays);
        payload.put("winReason", saved.getWinReason());
        payload.put("lossReason", saved.getLossReason());

        domainEventPublisher.publish(CrmDomainEvent.builder()
                .organizationId(orgId)
                .eventType("DEAL_STAGE_CHANGED")
                .entityType("DEAL")
                .entityId(saved.getId())
                .payload(payload)
                .build());

        if (targetStage == DealStage.WON) {
            domainEventPublisher.publish(CrmDomainEvent.builder()
                    .organizationId(orgId)
                    .eventType("DEAL_WON")
                    .entityType("DEAL")
                    .entityId(saved.getId())
                    .payload(payload)
                    .build());
        } else if (targetStage == DealStage.LOST) {
            domainEventPublisher.publish(CrmDomainEvent.builder()
                    .organizationId(orgId)
                    .eventType("DEAL_LOST")
                    .entityType("DEAL")
                    .entityId(saved.getId())
                    .payload(payload)
                    .build());
        }

        eventPublisher.publishEvent("DEAL_STAGE_CHANGED", orgId, saved);
        return saved;
    }

    @Transactional
    public void deleteDeal(String id) {
        Deal existing = getDealById(id);
        dealRepository.delete(existing);
    }

    @Transactional(readOnly = true)
    public PipelineMetricsResponse getPipelineMetrics(String pipelineId) {
        String orgId = TenantContext.getCurrentTenant();

        Pipeline pipeline;
        if (pipelineId != null && !pipelineId.isBlank()) {
            pipeline = pipelineRepository.findByIdAndOrganizationId(pipelineId, orgId)
                    .orElseThrow(() -> new ResourceNotFoundException("Pipeline not found: " + pipelineId));
        } else {
            pipeline = pipelineRepository.findByOrganizationIdAndIsDefaultTrue(orgId)
                    .orElseGet(() -> {
                        List<Pipeline> pipes = pipelineRepository.findAllByOrganizationId(orgId);
                        return pipes.isEmpty() ? null : pipes.get(0);
                    });
        }

        List<Deal> deals = (pipeline != null)
                ? dealRepository.findByOrganizationIdAndPipelineId(orgId, pipeline.getId())
                : dealRepository.findAllByOrganizationId(orgId);

        long totalDeals = deals.size();
        long wonDeals = deals.stream().filter(d -> d.getStage() == DealStage.WON).count();
        long lostDeals = deals.stream().filter(d -> d.getStage() == DealStage.LOST).count();
        long openDeals = totalDeals - wonDeals - lostDeals;

        BigDecimal totalPipelineValue = BigDecimal.ZERO;
        BigDecimal weightedPipelineValue = BigDecimal.ZERO;

        for (Deal d : deals) {
            if (d.getStage() != DealStage.WON && d.getStage() != DealStage.LOST && d.getValue() != null) {
                totalPipelineValue = totalPipelineValue.add(d.getValue());
                int prob = d.getProbability() != null ? d.getProbability() : 10;
                BigDecimal weighted = d.getValue().multiply(BigDecimal.valueOf(prob)).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                weightedPipelineValue = weightedPipelineValue.add(weighted);
            }
        }

        long closedDeals = wonDeals + lostDeals;
        double winRate = closedDeals > 0 ? (wonDeals * 100.0 / closedDeals) : 0.0;

        BigDecimal wonValue = deals.stream()
                .filter(d -> d.getStage() == DealStage.WON && d.getValue() != null)
                .map(Deal::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageDealSize = wonDeals > 0
                ? wonValue.divide(BigDecimal.valueOf(wonDeals), 2, RoundingMode.HALF_UP)
                : (totalDeals > 0 ? totalPipelineValue.divide(BigDecimal.valueOf(totalDeals), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);

        // Sales cycle calculation from deal_stage_history
        List<DealStageHistory> histories = dealStageHistoryRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
        double averageSalesCycleDays = calculateAverageCycleDays(histories, deals);

        // Stage metrics
        List<PipelineStage> stages = (pipeline != null)
                ? pipelineStageRepository.findByPipelineIdOrderByOrderIndexAsc(pipeline.getId())
                : Collections.emptyList();

        List<PipelineMetricsResponse.StageMetric> stageMetrics = stages.stream().map(stage -> {
            List<Deal> matching = deals.stream()
                    .filter(d -> stage.getId().equals(d.getStageId()) || (d.getStage() != null && d.getStage().name().equalsIgnoreCase(stage.getCode())))
                    .collect(Collectors.toList());

            BigDecimal val = matching.stream()
                    .map(Deal::getValue)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal weighted = val.multiply(BigDecimal.valueOf(stage.getWinProbability())).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            double avgAging = matching.stream()
                    .mapToLong(d -> {
                        LocalDateTime entered = d.getStageEnteredAt() != null ? d.getStageEnteredAt() : d.getCreatedAt();
                        return entered != null ? Math.max(0, ChronoUnit.DAYS.between(entered, LocalDateTime.now())) : 0;
                    })
                    .average()
                    .orElse(0.0);

            return PipelineMetricsResponse.StageMetric.builder()
                    .stageId(stage.getId())
                    .stageName(stage.getName())
                    .stageCode(stage.getCode())
                    .orderIndex(stage.getOrderIndex())
                    .winProbability(stage.getWinProbability())
                    .colorCode(stage.getColorCode())
                    .dealCount(matching.size())
                    .totalValue(val)
                    .weightedValue(weighted)
                    .averageAgingDays(Math.round(avgAging * 10.0) / 10.0)
                    .build();
        }).collect(Collectors.toList());

        return PipelineMetricsResponse.builder()
                .pipelineId(pipeline != null ? pipeline.getId() : "default")
                .pipelineName(pipeline != null ? pipeline.getName() : "All Deals Pipeline")
                .totalDeals(totalDeals)
                .openDeals(openDeals)
                .wonDeals(wonDeals)
                .lostDeals(lostDeals)
                .totalPipelineValue(totalPipelineValue)
                .weightedPipelineValue(weightedPipelineValue)
                .winRate(Math.round(winRate * 10.0) / 10.0)
                .averageDealSize(averageDealSize)
                .averageSalesCycleDays(Math.round(averageSalesCycleDays * 10.0) / 10.0)
                .stages(stageMetrics)
                .build();
    }

    @Transactional(readOnly = true)
    public RevenueForecastResponse getRevenueForecast() {
        String orgId = TenantContext.getCurrentTenant();
        List<Deal> allDeals = dealRepository.findAllByOrganizationId(orgId);

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        int currentQuarterNum = (now.getMonthValue() - 1) / 3 + 1;
        LocalDate startOfCurrentQuarter = LocalDate.of(now.getYear(), (currentQuarterNum - 1) * 3 + 1, 1);
        LocalDate endOfCurrentQuarter = startOfCurrentQuarter.plusMonths(3).minusDays(1);

        LocalDate startOfNextQuarter = endOfCurrentQuarter.plusDays(1);
        LocalDate endOfNextQuarter = startOfNextQuarter.plusMonths(3).minusDays(1);

        LocalDate startOfYear = LocalDate.of(now.getYear(), 1, 1);
        LocalDate endOfYear = LocalDate.of(now.getYear(), 12, 31);

        RevenueForecastResponse.ForecastPeriod monthPeriod = buildForecastPeriod("Current Month", allDeals, startOfMonth, endOfMonth);
        RevenueForecastResponse.ForecastPeriod currentQuarterPeriod = buildForecastPeriod("Q" + currentQuarterNum + " " + now.getYear(), allDeals, startOfCurrentQuarter, endOfCurrentQuarter);
        RevenueForecastResponse.ForecastPeriod nextQuarterPeriod = buildForecastPeriod("Next Quarter", allDeals, startOfNextQuarter, endOfNextQuarter);
        RevenueForecastResponse.ForecastPeriod fullYearPeriod = buildForecastPeriod("FY " + now.getYear(), allDeals, startOfYear, endOfYear);

        BigDecimal totalProjected = fullYearPeriod.getClosedWon().add(fullYearPeriod.getWeighted());
        BigDecimal totalWeighted = fullYearPeriod.getWeighted();

        return RevenueForecastResponse.builder()
                .totalProjectedRevenue(totalProjected)
                .totalWeightedPipeline(totalWeighted)
                .currentMonth(monthPeriod)
                .currentQuarter(currentQuarterPeriod)
                .nextQuarter(nextQuarterPeriod)
                .fullYear(fullYearPeriod)
                .build();
    }

    private RevenueForecastResponse.ForecastPeriod buildForecastPeriod(String name, List<Deal> allDeals, LocalDate start, LocalDate end) {
        BigDecimal closedWon = BigDecimal.ZERO;
        BigDecimal commit = BigDecimal.ZERO;
        BigDecimal bestCase = BigDecimal.ZERO;
        BigDecimal pipeline = BigDecimal.ZERO;
        BigDecimal weighted = BigDecimal.ZERO;
        long count = 0;

        for (Deal d : allDeals) {
            LocalDate closeDate = d.getExpectedCloseDate() != null ? d.getExpectedCloseDate() : (d.getCreatedAt() != null ? d.getCreatedAt().toLocalDate() : LocalDate.now());
            if (closeDate.isBefore(start) || closeDate.isAfter(end)) {
                continue;
            }

            count++;
            BigDecimal val = d.getValue() != null ? d.getValue() : BigDecimal.ZERO;
            int prob = d.getProbability() != null ? d.getProbability() : 10;

            if (d.getStage() == DealStage.WON) {
                closedWon = closedWon.add(val);
            } else if (d.getStage() != DealStage.LOST) {
                pipeline = pipeline.add(val);
                BigDecimal w = val.multiply(BigDecimal.valueOf(prob)).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                weighted = weighted.add(w);

                if (prob >= 70) {
                    commit = commit.add(val);
                }
                if (prob >= 40) {
                    bestCase = bestCase.add(val);
                }
            }
        }

        return RevenueForecastResponse.ForecastPeriod.builder()
                .periodName(name)
                .closedWon(closedWon)
                .commit(commit)
                .bestCase(bestCase)
                .pipeline(pipeline)
                .weighted(weighted)
                .dealCount(count)
                .build();
    }

    private double calculateAverageCycleDays(List<DealStageHistory> histories, List<Deal> deals) {
        Map<String, List<DealStageHistory>> historyByDeal = histories.stream()
                .collect(Collectors.groupingBy(DealStageHistory::getDealId));

        List<Long> closedDurations = new ArrayList<>();
        for (Deal deal : deals) {
            if (deal.getStage() == DealStage.WON || deal.getStage() == DealStage.LOST) {
                List<DealStageHistory> dealHistories = historyByDeal.get(deal.getId());
                if (dealHistories != null && !dealHistories.isEmpty()) {
                    long totalDays = dealHistories.stream().mapToLong(DealStageHistory::getDurationDays).sum();
                    closedDurations.add(totalDays);
                } else if (deal.getCreatedAt() != null) {
                    long days = Math.max(0, ChronoUnit.DAYS.between(deal.getCreatedAt(), LocalDateTime.now()));
                    closedDurations.add(days);
                }
            }
        }

        return closedDurations.stream().mapToLong(Long::longValue).average().orElse(14.0);
    }

    private DealStage mapCodeToDealStage(String code) {
        String clean = code.toUpperCase();
        if (clean.contains("WON") || clean.contains("CLOSE_WON")) return DealStage.WON;
        if (clean.contains("LOST") || clean.contains("CLOSE_LOST")) return DealStage.LOST;
        if (clean.contains("PROP") || clean.contains("QUOTE")) return DealStage.PROPOSAL;
        if (clean.contains("NEGOT")) return DealStage.NEGOTIATION;
        if (clean.contains("DEMO")) return DealStage.DEMO;
        if (clean.contains("QUAL")) return DealStage.QUALIFIED;
        return DealStage.NEW;
    }
}
