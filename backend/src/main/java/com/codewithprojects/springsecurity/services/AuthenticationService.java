package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.dto.JwtAuthenticationResponse;
import com.codewithprojects.springsecurity.dto.RefreshTokenRequest;
import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.dto.SigninRequest;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * Service interface for handling user authentication and authorization operations.
 */
public interface AuthenticationService {

    /**
     * Registers a new user with the given role and assigns a service if applicable.
     *
     * @param signUpRequest The request containing user details for signup.
     * @param role The role to be assigned to the user (USER, ADMIN, STAFF).
     * @param service_id The service ID to which the staff belongs (if applicable).
     * @return The created user entity.
     */
//    User signup(SignUpRequest signUpRequest, Role role, Integer service_id);

    /**
     * Authenticates a user based on provided credentials and returns a JWT token.
     *
     * @param signinRequest The request containing login credentials.
     * @return A response entity containing the JWT authentication response.
     */
    ResponseEntity<JwtAuthenticationResponse> signin(SigninRequest signinRequest);

    /**
     * Refreshes an expired JWT token using a valid refresh token.
     *
     * @param refreshTokenRequest The request containing the refresh token.
     * @return A new JWT authentication response containing the refreshed token.
     */
    JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    /**
     * Retrieves a list of all users with the STAFF role.
     *
     * @return A list of users who are assigned the STAFF role.
     */
    List<User> getAllStaff(); // Added method

    /**
     * Deletes a staff member by their user ID.
     *
     * @param id The ID of the staff member to be deleted.
     */
    void deleteStaff(Long id);

    /**
     * Updates an existing staff member's details.
     *
     * @param id The ID of the staff member to be updated.
     * @param updateRequest The request containing updated staff details.
     * @return The updated user entity.
     */
    User updateStaff(Long id, SignUpRequest updateRequest);

    boolean verifySignupOtp(String email, String otp);
    User signup(SignUpRequest signUpRequest, Role role, Integer service_id);
    boolean resendOtp(String email);
}
