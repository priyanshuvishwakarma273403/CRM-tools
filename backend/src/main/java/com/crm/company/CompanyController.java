package com.crm.company;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Company>>> getCompanies(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(companyService.getCompanies(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> getCompanyById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(companyService.getCompanyById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Company>> createCompany(@RequestBody Company company) {
        return ResponseEntity.ok(ApiResponse.success(companyService.createCompany(company), "Company created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> updateCompany(@PathVariable String id, @RequestBody Company company) {
        return ResponseEntity.ok(ApiResponse.success(companyService.updateCompany(id, company), "Company updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable String id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Company deleted successfully"));
    }
}
