package com.crm.user;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.security.TenantContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        String orgId = TenantContext.getCurrentTenant();
        return userRepository.findByOrganizationId(orgId);
    }

    public User getUserById(String id) {
        String orgId = TenantContext.getCurrentTenant();
        return userRepository.findById(id)
                .filter(u -> orgId.equals(u.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public User updateUser(String id, User details) {
        User user = getUserById(id);
        if (details.getFullName() != null) user.setFullName(details.getFullName());
        if (details.getRole() != null) user.setRole(details.getRole());
        user.setActive(details.isActive());
        return userRepository.save(user);
    }
}
