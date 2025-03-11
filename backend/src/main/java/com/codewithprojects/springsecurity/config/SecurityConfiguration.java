package com.codewithprojects.springsecurity.config;

import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserService userService;

    /**
     * Configures the security filter chain for HTTP requests.
     * - Enables CORS.
     * - Disables CSRF protection (useful for stateless APIs).
     * - Defines access control for different API endpoints based on roles.
     * - Configures session management as stateless (JWT-based authentication).
     * - Registers authentication provider and JWT filter.
     *
     * @param http HttpSecurity configuration object.
     * @return Configured SecurityFilterChain.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers("api/v1/auth/**").permitAll() // Public endpoints, accessible by anyone
                        .requestMatchers("api/v1/admin/**").hasAuthority(Role.ADMIN.name()) // Only accessible by ADMIN
                        .requestMatchers("api/v1/user/**").hasAuthority(Role.USER.name())   // Only accessible by USER
                        .requestMatchers("api/v1/token/**").hasAnyAuthority(Role.USER.name(), Role.ADMIN.name(), Role.STAFF.name()) // Accessible by USER, ADMIN, and STAFF
                        .anyRequest().authenticated() // All other requests require authentication
                )
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless authentication
                .authenticationProvider(authenticationProvider()) // Sets up the authentication provider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class // Adds JWT filter before processing authentication
                );
        return http.build();
    }

    /**
     * Configures the authentication provider using DAO-based authentication.
     * This validates users against the database and encodes passwords using BCrypt.
     *
     * @return Configured AuthenticationProvider.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userService.userDetailsService()); // Sets custom user details service
        authenticationProvider.setPasswordEncoder(passwordEncoder()); // Sets password encoder
        return authenticationProvider;
    }

    /**
     * Configures Cross-Origin Resource Sharing (CORS) settings.
     * - Allows requests from the frontend application.
     * - Supports common HTTP methods (GET, POST, PUT, DELETE, OPTIONS).
     * - Allows credentials such as authentication headers.
     *
     * @return Configured CorsFilter.
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Allow frontend origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        config.setAllowedHeaders(List.of("*")); // Allow all headers
        config.setAllowCredentials(true);
        config.addExposedHeader("Access-Control-Allow-Origin");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    /**
     * Creates a CORS configuration source to be used by the security filter.
     *
     * @return Configured UrlBasedCorsConfigurationSource.
     */
    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Allow frontend origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        config.setAllowedHeaders(List.of("*")); // Allow all headers
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Defines the password encoder used for encoding and verifying passwords.
     *
     * @return Password encoder using BCrypt hashing.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Provides the authentication manager, which handles authentication requests.
     *
     * @param config Authentication configuration.
     * @return Configured AuthenticationManager.
     * @throws Exception If an error occurs during initialization.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
