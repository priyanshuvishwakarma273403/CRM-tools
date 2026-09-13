package com.crm.workflow;

import com.crm.event.CrmDomainEvent;
import com.crm.notification.Notification;
import com.crm.notification.NotificationRepository;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.task.Task;
import com.crm.task.TaskPriority;
import com.crm.task.TaskRepository;
import com.crm.task.TaskStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Enterprise Event-Driven Workflow Automation Engine.
 * Evaluates incoming domain events, parses conditional rule logic, and dispatches automated actions.
 */
@Slf4j
@Service
public class WorkflowEngineService {

    private final WorkflowRuleRepository workflowRuleRepository;
    private final WorkflowExecutionRepository workflowExecutionRepository;
    private final OrganizationRepository organizationRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final ObjectProvider<com.crm.developer.WebhookService> webhookServiceProvider;
    private final ObjectProvider<com.crm.ai.AiServiceClient> aiServiceClientProvider;
    private final ObjectProvider<com.crm.approval.ActionApprovalService> actionApprovalServiceProvider;
    private final ObjectMapper objectMapper;

    public WorkflowEngineService(WorkflowRuleRepository workflowRuleRepository,
                                 WorkflowExecutionRepository workflowExecutionRepository,
                                 OrganizationRepository organizationRepository,
                                 TaskRepository taskRepository,
                                 NotificationRepository notificationRepository,
                                 ObjectProvider<com.crm.developer.WebhookService> webhookServiceProvider,
                                 ObjectProvider<com.crm.ai.AiServiceClient> aiServiceClientProvider,
                                 ObjectProvider<com.crm.approval.ActionApprovalService> actionApprovalServiceProvider,
                                 ObjectMapper objectMapper) {
        this.workflowRuleRepository = workflowRuleRepository;
        this.workflowExecutionRepository = workflowExecutionRepository;
        this.organizationRepository = organizationRepository;
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
        this.webhookServiceProvider = webhookServiceProvider;
        this.aiServiceClientProvider = aiServiceClientProvider;
        this.actionApprovalServiceProvider = actionApprovalServiceProvider;
        this.objectMapper = objectMapper;
    }

    /**
     * Entrypoint for domain events triggering workflow rules.
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processDomainEvent(CrmDomainEvent event) {
        if (event == null || event.getOrganizationId() == null || event.getEventType() == null) {
            return;
        }

        String orgId = event.getOrganizationId();
        String triggerType = event.getEventType();

        List<WorkflowRule> rules = workflowRuleRepository.findByOrganizationId(orgId).stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsActive()))
                .filter(r -> triggerType.equalsIgnoreCase(r.getTriggerType()))
                .toList();

        if (rules.isEmpty()) {
            return;
        }

        log.info("Found {} active workflow rules for trigger: {} in organization: {}", rules.size(), triggerType, orgId);

        for (WorkflowRule rule : rules) {
            executeRule(rule, event);
        }
    }

    /**
     * Executes a single workflow rule against an event or entity payload.
     */
    public WorkflowExecution executeRule(WorkflowRule rule, CrmDomainEvent event) {
        String entityType = event.getEntityType() != null ? event.getEntityType() : "GENERIC";
        String entityId = event.getEntityId() != null ? event.getEntityId() : rule.getId();

        WorkflowExecution execution = WorkflowExecution.builder()
                .organizationId(rule.getOrganizationId())
                .workflowId(rule.getId())
                .entityType(entityType)
                .entityId(entityId)
                .executedAt(LocalDateTime.now())
                .build();

        try {
            boolean conditionsMet = evaluateConditions(rule.getConditionJson(), event.getPayload());

            if (!conditionsMet) {
                execution.setStatus("CONDITION_UNMET");
                execution.setExecutionLog("Conditions defined in rule were not met for event payload.");
                return workflowExecutionRepository.save(execution);
            }

            // Execute the configured action
            String actionResult = executeAction(rule, event);

            execution.setStatus("SUCCESS");
            execution.setExecutionLog("Executed action: " + rule.getActionType() + ". Result: " + actionResult);
            log.info("Workflow rule '{}' ({}) executed successfully for entity {}:{}", rule.getName(), rule.getId(), entityType, entityId);
            return workflowExecutionRepository.save(execution);

        } catch (Exception e) {
            log.error("Failed to execute workflow rule '{}' ({}): {}", rule.getName(), rule.getId(), e.getMessage(), e);
            execution.setStatus("FAILED");
            execution.setExecutionLog("Error: " + e.getMessage());
            return workflowExecutionRepository.save(execution);
        }
    }

    /**
     * Evaluates condition JSON against the event payload.
     * Supports:
     * - Empty/null condition -> returns true
     * - {"field": "score", "operator": "GREATER_THAN", "value": 75}
     * - {"conditions": [...], "match": "ALL" | "ANY"}
     */
    public boolean evaluateConditions(String conditionJson, Map<String, Object> payload) {
        if (conditionJson == null || conditionJson.trim().isEmpty() || "{}".equals(conditionJson.trim())) {
            return true;
        }
        if (payload == null || payload.isEmpty()) {
            return false;
        }

        try {
            JsonNode root = objectMapper.readTree(conditionJson);

            if (root.has("conditions") && root.get("conditions").isArray()) {
                String match = root.has("match") ? root.get("match").asText("ALL").toUpperCase() : "ALL";
                boolean isAny = "ANY".equals(match);

                for (JsonNode cond : root.get("conditions")) {
                    boolean result = evaluateSingleCondition(cond, payload);
                    if (isAny && result) return true;
                    if (!isAny && !result) return false;
                }
                return !isAny; // If ALL, reached end means all true; If ANY, none was true
            }

            return evaluateSingleCondition(root, payload);

        } catch (Exception e) {
            log.warn("Failed to parse condition JSON: {}, defaulting to false: {}", conditionJson, e.getMessage());
            return false;
        }
    }

    private boolean evaluateSingleCondition(JsonNode node, Map<String, Object> payload) {
        if (!node.has("field")) {
            return true;
        }
        String field = node.get("field").asText();
        String operator = node.has("operator") ? node.get("operator").asText().toUpperCase() : "EQUALS";
        JsonNode expectedNode = node.get("value");

        Object actualValue = resolveFieldValue(field, payload);
        if (actualValue == null) {
            return "IS_NULL".equals(operator);
        }
        if ("IS_NOT_NULL".equals(operator)) {
            return true;
        }

        String actualStr = String.valueOf(actualValue);
        String expectedStr = expectedNode != null ? expectedNode.asText() : "";

        return switch (operator) {
            case "EQUALS" -> actualStr.equalsIgnoreCase(expectedStr);
            case "NOT_EQUALS" -> !actualStr.equalsIgnoreCase(expectedStr);
            case "CONTAINS" -> actualStr.toLowerCase().contains(expectedStr.toLowerCase());
            case "STARTS_WITH" -> actualStr.toLowerCase().startsWith(expectedStr.toLowerCase());
            case "GREATER_THAN" -> compareNumbers(actualValue, expectedStr) > 0;
            case "LESS_THAN" -> compareNumbers(actualValue, expectedStr) < 0;
            case "GREATER_THAN_OR_EQUAL" -> compareNumbers(actualValue, expectedStr) >= 0;
            case "LESS_THAN_OR_EQUAL" -> compareNumbers(actualValue, expectedStr) <= 0;
            default -> actualStr.equalsIgnoreCase(expectedStr);
        };
    }

    private Object resolveFieldValue(String field, Map<String, Object> payload) {
        if (payload.containsKey(field)) {
            return payload.get(field);
        }
        // Case-insensitive fallback
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(field)) {
                return entry.getValue();
            }
        }
        return null;
    }

    private int compareNumbers(Object actual, String expectedStr) {
        try {
            BigDecimal a = new BigDecimal(String.valueOf(actual));
            BigDecimal b = new BigDecimal(expectedStr);
            return a.compareTo(b);
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Executes the configured action.
     */
    private String executeAction(WorkflowRule rule, CrmDomainEvent event) throws Exception {
        String actionType = rule.getActionType() != null ? rule.getActionType().toUpperCase() : "LOG";
        String configJson = rule.getActionConfigJson();
        JsonNode config = (configJson != null && !configJson.isBlank())
                ? objectMapper.readTree(configJson)
                : objectMapper.createObjectNode();

        String orgId = rule.getOrganizationId();
        Organization org = organizationRepository.findById(orgId).orElse(null);

        switch (actionType) {
            case "CREATE_TASK": {
                String title = config.has("title") ? config.get("title").asText() : "Automated Workflow Task: " + rule.getName();
                String description = config.has("description") ? config.get("description").asText() : "Created by workflow rule: " + rule.getName();
                int dueInDays = config.has("dueInDays") ? config.get("dueInDays").asInt(2) : 2;
                String priorityStr = config.has("priority") ? config.get("priority").asText("MEDIUM") : "MEDIUM";

                TaskPriority priority;
                try {
                    priority = TaskPriority.valueOf(priorityStr.toUpperCase());
                } catch (Exception e) {
                    priority = TaskPriority.MEDIUM;
                }

                Task task = Task.builder()
                        .organization(org)
                        .title(title)
                        .description(description)
                        .dueDate(LocalDateTime.now().plusDays(dueInDays))
                        .priority(priority)
                        .status(TaskStatus.TODO)
                        .relatedEntityType(event.getEntityType())
                        .relatedEntityId(event.getEntityId())
                        .build();

                Task savedTask = taskRepository.save(task);
                return "Task created with ID: " + savedTask.getId();
            }

            case "SEND_NOTIFICATION": {
                String title = config.has("title") ? config.get("title").asText() : "Workflow Alert: " + rule.getName();
                String message = config.has("message") ? config.get("message").asText() : "Event triggered for " + event.getEntityType() + ": " + event.getEntityId();
                String userId = config.has("userId") ? config.get("userId").asText() : (event.getActorId() != null ? event.getActorId() : "system");

                Notification notification = Notification.builder()
                        .organization(org)
                        .userId(userId)
                        .title(title)
                        .message(message)
                        .isRead(false)
                        .build();

                Notification saved = notificationRepository.save(notification);
                return "Notification dispatched with ID: " + saved.getId();
            }

            case "TRIGGER_WEBHOOK": {
                com.crm.developer.WebhookService webhookService = webhookServiceProvider.getIfAvailable();
                if (webhookService != null) {
                    webhookService.dispatchEvent(orgId, "workflow." + rule.getTriggerType(), event.getPayload());
                    return "Webhook dispatched for event: workflow." + rule.getTriggerType();
                }
                return "Webhook service unavailable";
            }

            case "INVOKE_AI_AGENT": {
                com.crm.ai.AiServiceClient aiClient = aiServiceClientProvider.getIfAvailable();
                if (aiClient != null) {
                    String agentType = config.has("agentType") ? config.get("agentType").asText("SALES") : "SALES";
                    String taskDesc = config.has("task") ? config.get("task").asText() : "Analyze " + event.getEntityType() + " " + event.getEntityId();

                    Map<String, Object> aiResult = aiClient.executeAgentTask(Map.of(
                            "agent_type", agentType,
                            "task", taskDesc,
                            "payload", event.getPayload()
                    ));
                    return "AI Agent invoked: " + aiResult.getOrDefault("agent_name", "Done");
                }
                return "AI client unavailable";
            }

            case "REQUEST_APPROVAL": {
                com.crm.approval.ActionApprovalService approvalService = actionApprovalServiceProvider.getIfAvailable();
                if (approvalService != null) {
                    String title = config.has("title") ? config.get("title").asText() : "Workflow Approval: " + rule.getName();
                    String description = config.has("description") ? config.get("description").asText() : "Approval requested for " + event.getEntityType() + " " + event.getEntityId();

                    com.crm.approval.ActionApproval approval = com.crm.approval.ActionApproval.builder()
                            .organizationId(orgId)
                            .actionType("WORKFLOW_" + rule.getName().toUpperCase().replace(" ", "_"))
                            .title(title)
                            .description(description)
                            .entityType(event.getEntityType())
                            .entityId(event.getEntityId())
                            .payloadJson(objectMapper.writeValueAsString(event.getPayload()))
                            .build();

                    com.crm.approval.ActionApproval savedApproval = approvalService.submitRequest(approval);
                    return "Action approval requested with ID: " + savedApproval.getId();
                }
                return "Approval service unavailable";
            }

            default:
                return "Executed default action: " + actionType;
        }
    }
}
