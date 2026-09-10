package com.crm.task;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Task>>> getTasks(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(taskService.getTasks(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTaskById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> createTask(@RequestBody Task task) {
        return ResponseEntity.ok(ApiResponse.success(taskService.createTask(task), "Task created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(@PathVariable String id, @RequestBody Task task) {
        return ResponseEntity.ok(ApiResponse.success(taskService.updateTask(id, task), "Task updated successfully"));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Task>> completeTask(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(taskService.completeTask(id), "Task completed"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }
}
