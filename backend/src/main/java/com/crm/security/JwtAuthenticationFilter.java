package com.crm.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final org.springframework.beans.factory.ObjectProvider<com.crm.identity.SessionService> sessionServiceProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider,
                                   org.springframework.beans.factory.ObjectProvider<com.crm.identity.SessionService> sessionServiceProvider) {
        this.jwtProvider = jwtProvider;
        this.sessionServiceProvider = sessionServiceProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            if (StringUtils.hasText(jwt) && jwtProvider.validateToken(jwt)) {
                com.crm.identity.SessionService sessionService = sessionServiceProvider.getIfAvailable();
                if (sessionService != null && sessionService.isTokenRevoked(jwt)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Session has been revoked");
                    return;
                }

                Claims claims = jwtProvider.parseToken(jwt);
                String userId = claims.getSubject();
                String email = claims.get("email", String.class);
                String orgId = claims.get("organizationId", String.class);
                String role = claims.get("role", String.class);

                TenantContext.setCurrentTenant(orgId);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );
                authentication.setDetails(claims);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
