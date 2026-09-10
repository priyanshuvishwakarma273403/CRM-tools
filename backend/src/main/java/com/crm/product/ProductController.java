package com.crm.product;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Product>>> getProducts(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(productService.getProducts(pageable))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.success(productService.createProduct(product), "Product created successfully"));
    }
}
