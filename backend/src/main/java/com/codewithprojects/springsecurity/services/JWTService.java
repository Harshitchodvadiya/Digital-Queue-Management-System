package com.codewithprojects.springsecurity.services;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

/**
 * Service interface for handling JWT (JSON Web Token) operations.
 */
public interface JWTService {

    /**
     * Extracts the username from the given JWT token.
     *
     * @param token The JWT token.
     * @return The extracted username.
     */
    String extractUserName(String token);

    /**
     * Extracts the user role from the given JWT token.
     *
     * @param token The JWT token.
     * @return The extracted role as a string.
     */
    String extractUserRole(String token); // New method to extract role

    /**
     * Generates a JWT token for the given user details.
     *
     * @param userDetails The user details containing authentication information.
     * @return The generated JWT token.
     */
    String generateToken(UserDetails userDetails);

    /**
     * Generates a refresh token with additional claims.
     *
     * @param extraClaims Additional claims to be included in the token.
     * @param userDetails The user details associated with the token.
     * @return The generated refresh token.
     */
    String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails);

    /**
     * Validates whether the given JWT token is valid for the specified user.
     *
     * @param token The JWT token to validate.
     * @param userDetails The user details to compare against.
     * @return True if the token is valid, false otherwise.
     */
    boolean isTokenValid(String token, UserDetails userDetails);
}
