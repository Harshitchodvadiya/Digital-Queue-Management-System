package com.codewithprojects.springsecurity.services;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JWTService {
    String extractUserName(String token);
    String extractUserRole(String token); // New method to extract role

    String generateToken(UserDetails userDetails);
    String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);
}
