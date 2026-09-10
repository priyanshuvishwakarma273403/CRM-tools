package com.crm.customer;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Customer>>> getCustomers(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(customerService.getCustomers(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomerById(id)));
    }

    @GetMapping("/{id}/360")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomer360(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomer360(id), "Customer 360 profile loaded"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(ApiResponse.success(customerService.createCustomer(customer), "Customer created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable String id, @RequestBody Customer customer) {
        return ResponseEntity.ok(ApiResponse.success(customerService.updateCustomer(id, customer), "Customer updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Customer deleted successfully"));
    }
}
