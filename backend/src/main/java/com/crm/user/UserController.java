package com.crm.user;

import com.crm.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsers()));
    }

    @GetMapping("/team")
    public ResponseEntity<ApiResponse<List<User>>> getTeam() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable String id, @RequestBody User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, user), "User updated successfully"));
    }
}
