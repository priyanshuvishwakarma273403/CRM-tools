package com.crm.search;

import com.crm.common.dto.ApiResponse;
import com.crm.deal.Deal;
import com.crm.deal.DealRepository;
import com.crm.lead.Lead;
import com.crm.lead.LeadRepository;
import com.crm.security.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;

    public SearchController(LeadRepository leadRepository, DealRepository dealRepository) {
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> search(@RequestParam("q") String query) {
        String orgId = TenantContext.getCurrentTenant();

        List<Lead> leads = leadRepository.findAllByOrganizationId(orgId).stream()
                .filter(l -> (l.getFirstName() + " " + l.getLastName() + " " + l.getCompanyName()).toLowerCase().contains(query.toLowerCase()))
                .limit(5)
                .toList();

        List<Deal> deals = dealRepository.findAllByOrganizationId(orgId).stream()
                .filter(d -> d.getTitle().toLowerCase().contains(query.toLowerCase()))
                .limit(5)
                .toList();

        Map<String, Object> results = new HashMap<>();
        results.put("leads", leads);
        results.put("deals", deals);

        return ResponseEntity.ok(ApiResponse.success(results, "Search completed"));
    }
}
