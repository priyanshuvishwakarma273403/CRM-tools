package com.crm.product;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final OrganizationRepository organizationRepository;

    public ProductService(ProductRepository productRepository, OrganizationRepository organizationRepository) {
        this.productRepository = productRepository;
        this.organizationRepository = organizationRepository;
    }

    public Page<Product> getProducts(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return productRepository.findByOrganizationId(orgId, pageable);
    }

    @Transactional
    public Product createProduct(Product product) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        product.setOrganization(org);
        return productRepository.save(product);
    }
}
