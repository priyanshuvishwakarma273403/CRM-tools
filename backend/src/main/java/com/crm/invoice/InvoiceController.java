package com.crm.invoice;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Invoice>>> getInvoices(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(invoiceService.getInvoices(pageable))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@RequestBody Invoice invoice) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.createInvoice(invoice), "Invoice created successfully"));
    }
}
