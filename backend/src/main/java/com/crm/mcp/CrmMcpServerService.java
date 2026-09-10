package com.crm.mcp;

import com.crm.customer.Customer;
import com.crm.customer.CustomerRepository;
import com.crm.customer.CustomerService;
import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.deal.DealService;
import com.crm.deal.DealStage;
import com.crm.lead.Lead;
import com.crm.lead.LeadRepository;
import com.crm.lead.LeadService;
import com.crm.lead.LeadStatus;
import com.crm.security.TenantContext;
import com.crm.task.Task;
import com.crm.task.TaskPriority;
import com.crm.task.TaskRepository;
import com.crm.task.TaskService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class CrmMcpServerService {

    private final CustomerService customerService;
    private final CustomerRepository customerRepository;
    private final LeadService leadService;
    private final LeadRepository leadRepository;
    private final DealService dealService;
    private final DealRepository dealRepository;
    private final TaskService taskService;
    private final TaskRepository taskRepository;

    public CrmMcpServerService(CustomerService customerService,
                               CustomerRepository customerRepository,
                               LeadService leadService,
                               LeadRepository leadRepository,
                               DealService dealService,
                               DealRepository dealRepository,
                               TaskService taskService,
                               TaskRepository taskRepository) {
        this.customerService = customerService;
        this.customerRepository = customerRepository;
        this.leadService = leadService;
        this.leadRepository = leadRepository;
        this.dealService = dealService;
        this.dealRepository = dealRepository;
        this.taskService = taskService;
        this.taskRepository = taskRepository;
    }

    public List<McpToolDto> getBuiltinTools() {
        List<McpToolDto> tools = new ArrayList<>();

        // 1. crm.search_customer
        tools.add(McpToolDto.builder()
                .name("crm.search_customer")
                .description("Search customers in CRM by name keywords, status or limit")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "query", Map.of("type", "string", "description", "Substring to filter customer names"),
                                "status", Map.of("type", "string", "description", "Customer status (ACTIVE, INACTIVE, CHURNED)"),
                                "limit", Map.of("type", "integer", "description", "Max results to return (default 10)")
                        )
                ))
                .build());

        // 2. crm.get_customer_360
        tools.add(McpToolDto.builder()
                .name("crm.get_customer_360")
                .description("Retrieve complete Customer 360 profile including contact, deals, communications, and health metrics")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "customerId", Map.of("type", "string", "description", "UUID of the customer")
                        ),
                        "required", List.of("customerId")
                ))
                .build());

        // 3. crm.create_customer
        tools.add(McpToolDto.builder()
                .name("crm.create_customer")
                .description("Create a new customer account in the CRM")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "name", Map.of("type", "string", "description", "Company or Customer Name"),
                                "industry", Map.of("type", "string", "description", "Industry vertical"),
                                "tier", Map.of("type", "string", "description", "Account Tier (STANDARD, PREMIUM, ENTERPRISE)"),
                                "customerType", Map.of("type", "string", "description", "ORGANIZATION or INDIVIDUAL"),
                                "tags", Map.of("type", "string", "description", "Comma separated tags")
                        ),
                        "required", List.of("name")
                ))
                .build());

        // 4. crm.search_lead
        tools.add(McpToolDto.builder()
                .name("crm.search_lead")
                .description("Search inbound leads by status, name, company or score")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "query", Map.of("type", "string", "description", "Search query across lead names and companies"),
                                "status", Map.of("type", "string", "description", "NEW, CONTACTED, QUALIFIED, UNQUALIFIED, CONVERTED, LOST"),
                                "limit", Map.of("type", "integer", "description", "Max results (default 10)")
                        )
                ))
                .build());

        // 5. crm.create_lead
        tools.add(McpToolDto.builder()
                .name("crm.create_lead")
                .description("Create a new sales lead")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "firstName", Map.of("type", "string", "description", "Lead first name"),
                                "lastName", Map.of("type", "string", "description", "Lead last name"),
                                "companyName", Map.of("type", "string", "description", "Lead company name"),
                                "email", Map.of("type", "string", "description", "Lead email address"),
                                "phone", Map.of("type", "string", "description", "Lead phone number"),
                                "status", Map.of("type", "string", "description", "NEW, CONTACTED, QUALIFIED")
                        ),
                        "required", List.of("firstName", "lastName")
                ))
                .build());

        // 6. crm.get_deal
        tools.add(McpToolDto.builder()
                .name("crm.get_deal")
                .description("Fetch deal details by ID")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "dealId", Map.of("type", "string", "description", "UUID of the deal")
                        ),
                        "required", List.of("dealId")
                ))
                .build());

        // 7. crm.create_deal
        tools.add(McpToolDto.builder()
                .name("crm.create_deal")
                .description("Create a new deal opportunity in the pipeline")
                .destructive(false)
                .requireConfirmation(true)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "title", Map.of("type", "string", "description", "Title/name of the deal"),
                                "value", Map.of("type", "number", "description", "Deal monetary value"),
                                "stage", Map.of("type", "string", "description", "NEW, QUALIFIED, DEMO, PROPOSAL, NEGOTIATION, WON, LOST"),
                                "probability", Map.of("type", "integer", "description", "Probability 0-100")
                        ),
                        "required", List.of("title", "value")
                ))
                .build());

        // 8. crm.create_task
        tools.add(McpToolDto.builder()
                .name("crm.create_task")
                .description("Schedule an action item or follow-up task")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "title", Map.of("type", "string", "description", "Task title"),
                                "description", Map.of("type", "string", "description", "Task description"),
                                "priority", Map.of("type", "string", "description", "LOW, MEDIUM, HIGH, URGENT"),
                                "dueDate", Map.of("type", "string", "description", "Due date ISO string e.g. 2026-09-30T17:00:00")
                        ),
                        "required", List.of("title")
                ))
                .build());

        // 9. crm.get_sales_report
        tools.add(McpToolDto.builder()
                .name("crm.get_sales_report")
                .description("Calculate dashboard metrics and sales pipeline health summary")
                .destructive(false)
                .requireConfirmation(false)
                .source("BUILTIN")
                .inputSchema(Map.of("type", "object", "properties", Map.of()))
                .build());

        return tools;
    }

    public Object executeBuiltinTool(String toolName, Map<String, Object> params) {
        String orgId = TenantContext.getCurrentTenant();
        if (params == null) params = Collections.emptyMap();

        switch (toolName) {
            case "crm.search_customer": {
                int limit = getIntParam(params, "limit", 10);
                String query = (String) params.get("query");
                var page = customerRepository.findAllByOrganizationId(orgId, PageRequest.of(0, limit));
                if (query != null && !query.isBlank()) {
                    String qLower = query.toLowerCase();
                    return page.getContent().stream()
                            .filter(c -> c.getName() != null && c.getName().toLowerCase().contains(qLower))
                            .toList();
                }
                return page.getContent();
            }

            case "crm.get_customer_360": {
                String customerId = (String) params.get("customerId");
                if (customerId == null || customerId.isBlank()) {
                    throw new IllegalArgumentException("customerId is required for crm.get_customer_360");
                }
                return customerService.getCustomer360(customerId);
            }

            case "crm.create_customer": {
                String name = (String) params.get("name");
                if (name == null || name.isBlank()) {
                    throw new IllegalArgumentException("name is required for crm.create_customer");
                }
                Customer customer = Customer.builder()
                        .name(name)
                        .customerType((String) params.getOrDefault("customerType", "ORGANIZATION"))
                        .industry((String) params.get("industry"))
                        .tier((String) params.getOrDefault("tier", "STANDARD"))
                        .tags((String) params.get("tags"))
                        .build();
                return customerService.createCustomer(customer);
            }

            case "crm.search_lead": {
                int limit = getIntParam(params, "limit", 10);
                String query = (String) params.get("query");
                String statusStr = (String) params.get("status");

                var page = leadRepository.findByOrganizationId(orgId, PageRequest.of(0, limit));
                return page.getContent().stream()
                        .filter(lead -> {
                            if (statusStr != null && !statusStr.isBlank() && lead.getStatus() != null) {
                                if (!lead.getStatus().name().equalsIgnoreCase(statusStr)) return false;
                            }
                            if (query != null && !query.isBlank()) {
                                String q = query.toLowerCase();
                                boolean matchName = (lead.getFirstName() != null && lead.getFirstName().toLowerCase().contains(q)) ||
                                                    (lead.getLastName() != null && lead.getLastName().toLowerCase().contains(q));
                                boolean matchCompany = lead.getCompanyName() != null && lead.getCompanyName().toLowerCase().contains(q);
                                return matchName || matchCompany;
                            }
                            return true;
                        })
                        .toList();
            }

            case "crm.create_lead": {
                String firstName = (String) params.get("firstName");
                String lastName = (String) params.get("lastName");
                if (firstName == null || lastName == null) {
                    throw new IllegalArgumentException("firstName and lastName are required for crm.create_lead");
                }
                Lead lead = Lead.builder()
                        .firstName(firstName)
                        .lastName(lastName)
                        .companyName((String) params.get("companyName"))
                        .email((String) params.get("email"))
                        .phone((String) params.get("phone"))
                        .status(LeadStatus.NEW)
                        .build();
                if (params.containsKey("status")) {
                    try {
                        lead.setStatus(LeadStatus.valueOf(((String) params.get("status")).toUpperCase()));
                    } catch (Exception ignored) {}
                }
                return leadService.createLead(lead);
            }

            case "crm.get_deal": {
                String dealId = (String) params.get("dealId");
                if (dealId == null || dealId.isBlank()) {
                    throw new IllegalArgumentException("dealId is required for crm.get_deal");
                }
                return dealService.getDealById(dealId);
            }

            case "crm.create_deal": {
                String title = (String) params.get("title");
                if (title == null || title.isBlank()) {
                    throw new IllegalArgumentException("title is required for crm.create_deal");
                }
                BigDecimal val = BigDecimal.ZERO;
                if (params.get("value") != null) {
                    val = new BigDecimal(params.get("value").toString());
                }
                Deal deal = Deal.builder()
                        .title(title)
                        .value(val)
                        .stage(DealStage.QUALIFIED)
                        .probability(getIntParam(params, "probability", 50))
                        .build();
                if (params.containsKey("stage")) {
                    try {
                        deal.setStage(DealStage.valueOf(((String) params.get("stage")).toUpperCase()));
                    } catch (Exception ignored) {}
                }
                return dealService.createDeal(deal);
            }

            case "crm.create_task": {
                String title = (String) params.get("title");
                if (title == null || title.isBlank()) {
                    throw new IllegalArgumentException("title is required for crm.create_task");
                }
                Task task = Task.builder()
                        .title(title)
                        .description((String) params.get("description"))
                        .priority(TaskPriority.MEDIUM)
                        .build();
                if (params.containsKey("priority")) {
                    try {
                        task.setPriority(TaskPriority.valueOf(((String) params.get("priority")).toUpperCase()));
                    } catch (Exception ignored) {}
                }
                if (params.containsKey("dueDate")) {
                    try {
                        task.setDueDate(LocalDateTime.parse((String) params.get("dueDate"), DateTimeFormatter.ISO_DATE_TIME));
                    } catch (Exception ignored) {}
                }
                return taskService.createTask(task);
            }

            case "crm.get_sales_report": {
                long totalLeads = leadRepository.countByOrganizationId(orgId);
                var deals = dealRepository.findAllByOrganizationId(orgId);
                BigDecimal totalRevenue = dealRepository.sumTotalRevenueByOrganizationId(orgId);
                if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;
                long completedTasks = taskRepository.countCompletedByOrganizationId(orgId);

                Map<String, Long> stageBreakdown = new HashMap<>();
                for (Deal d : deals) {
                    if (d.getStage() != null) {
                        stageBreakdown.merge(d.getStage().name(), 1L, Long::sum);
                    }
                }

                return Map.of(
                        "totalLeads", totalLeads,
                        "openDeals", deals.size(),
                        "totalRevenue", totalRevenue,
                        "dealsByStage", stageBreakdown,
                        "completedTasks", completedTasks
                );
            }

            default:
                throw new IllegalArgumentException("Unknown built-in tool: " + toolName);
        }
    }

    private int getIntParam(Map<String, Object> params, String key, int defaultValue) {
        Object val = params.get(key);
        if (val instanceof Number) {
            return ((Number) val).intValue();
        }
        if (val instanceof String) {
            try {
                return Integer.parseInt((String) val);
            } catch (Exception ignored) {}
        }
        return defaultValue;
    }
}
