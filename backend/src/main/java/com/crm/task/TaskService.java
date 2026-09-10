package com.crm.task;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final OrganizationRepository organizationRepository;
    private final com.crm.websocket.CrmEventPublisher eventPublisher;

    public TaskService(TaskRepository taskRepository, 
                       OrganizationRepository organizationRepository,
                       com.crm.websocket.CrmEventPublisher eventPublisher) {
        this.taskRepository = taskRepository;
        this.organizationRepository = organizationRepository;
        this.eventPublisher = eventPublisher;
    }

    public Page<Task> getTasks(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return taskRepository.findByOrganizationId(orgId, pageable);
    }

    public Task getTaskById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return taskRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    @Transactional
    public Task createTask(Task task) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        task.setOrganization(org);
        Task saved = taskRepository.save(task);
        eventPublisher.publishEvent("TASK_CREATED", orgId, saved);
        return saved;
    }

    @Transactional
    public Task updateTask(String id, Task details) {
        Task existing = getTaskById(id);
        existing.setTitle(details.getTitle());
        existing.setDescription(details.getDescription());
        existing.setDueDate(details.getDueDate());
        existing.setPriority(details.getPriority());
        existing.setStatus(details.getStatus());
        Task saved = taskRepository.save(existing);
        eventPublisher.publishEvent("TASK_UPDATED", TenantContext.getCurrentTenant(), saved);
        return saved;
    }

    @Transactional
    public Task completeTask(String id) {
        Task existing = getTaskById(id);
        existing.setStatus(TaskStatus.COMPLETED);
        Task saved = taskRepository.save(existing);
        eventPublisher.publishEvent("TASK_COMPLETED", TenantContext.getCurrentTenant(), saved);
        return saved;
    }

    @Transactional
    public void deleteTask(String id) {
        Task existing = getTaskById(id);
        taskRepository.delete(existing);
    }
}
