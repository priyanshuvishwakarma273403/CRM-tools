package com.crm.activity;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final OrganizationRepository organizationRepository;

    public ActivityService(ActivityRepository activityRepository, OrganizationRepository organizationRepository) {
        this.activityRepository = activityRepository;
        this.organizationRepository = organizationRepository;
    }

    public Page<Activity> getActivities(Pageable pageable) {
        String orgId = TenantContext.getCurrentTenant();
        return activityRepository.findByOrganizationId(orgId, pageable);
    }

    public List<Activity> getActivitiesForEntity(String entityType, String entityId) {
        String orgId = TenantContext.getCurrentTenant();
        return activityRepository.findByEntity(orgId, entityType, entityId);
    }

    @Transactional
    public Activity logActivity(Activity activity) {
        String orgId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        activity.setOrganization(org);
        return activityRepository.save(activity);
    }
}
