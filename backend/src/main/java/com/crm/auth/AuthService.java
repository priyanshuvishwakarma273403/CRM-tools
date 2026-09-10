package com.crm.auth;

import com.crm.auth.dto.*;
import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.JwtProvider;
import com.crm.user.Role;
import com.crm.user.User;
import com.crm.user.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        Organization org = Organization.builder()
                .name(request.getOrganizationName())
                .build();
        org = organizationRepository.save(org);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .organization(org)
                .role(Role.ADMIN)
                .active(true)
                .build();
        user = userRepository.save(user);

        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), org.getId(), user.getRole().name());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(user)
                .organization(org)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new IllegalStateException("User account is deactivated");
        }

        Organization org = user.getOrganization();
        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), org.getId(), user.getRole().name());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(user)
                .organization(org)
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtProvider.validateToken(request.getRefreshToken())) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        Claims claims = jwtProvider.parseToken(request.getRefreshToken());
        String userId = claims.getSubject();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Organization org = user.getOrganization();
        String newAccessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), org.getId(), user.getRole().name());
        String newRefreshToken = jwtProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(user)
                .organization(org)
                .build();
    }

    public User getCurrentUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
