package com.codewithprojects.springsecurity.config;

import com.codewithprojects.springsecurity.services.JWTService;
import com.codewithprojects.springsecurity.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor

//OncePerRequestFilter : any filter should run only once
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserService userService;

    /**
     * This method intercepts incoming HTTP requests and extracts the JWT token from the Authorization header.
     * It validates the token and sets up authentication in the SecurityContext if the token is valid.
     *
     * @param request     Incoming HTTP request.
     * @param response    HTTP response.
     * @param filterChain The filter chain to pass the request along.
     * @throws ServletException If an error occurs during filtering.
     * @throws IOException      If an input or output exception occurs.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Check if Authorization header is missing or doesn't start with "Bearer "
        if (StringUtils.isEmpty(authHeader) || !org.apache.commons.lang3.StringUtils.startsWith(authHeader, "Bearer")) {
            // Allow the request to proceed without authentication
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token by removing "Bearer " prefix
        jwt = authHeader.substring(7);

        // Extract the user email from the token
        userEmail = jwtService.extractUserName(jwt).split("/")[0];

        // Check if the user is not already authenticated and if the extracted username is valid
        if (io.micrometer.common.util.StringUtils.isNotEmpty(userEmail) || SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details from the database
            UserDetails userDetails = userService.userDetailsService().loadUserByUsername(userEmail);

            // Validate the JWT token
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // Create a new security context
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                // Create authentication token/ get role
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );

                // Associate authentication token with the request details
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the authentication in the security context,
                // At this point, the user's roles/authorities are in memory.
                securityContext.setAuthentication(token);
                SecurityContextHolder.setContext(securityContext);
            }
        }

        // Proceed with the request
        filterChain.doFilter(request, response);
    }
}
