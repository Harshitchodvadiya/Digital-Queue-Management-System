package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.dto.JwtAuthenticationResponse;
import com.codewithprojects.springsecurity.dto.RefreshTokenRequest;
import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.dto.SigninRequest;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    /**
     * Registers a new user with the default role as USER.
     *
     * @param signUpRequest The sign-up request containing user details.
     * @return The registered user entity.
     */
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignUpRequest signUpRequest) {
        Integer service_id;
        return ResponseEntity.ok(authenticationService.signup(signUpRequest, Role.USER, service_id = 0));
    }

    /**
     * Authenticates a user and generates a JWT access token.
     *
     * @param signinRequest The sign-in request containing user credentials.
     * @return A response containing the JWT access and refresh tokens.
     */
    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest signinRequest) {
        return authenticationService.signin(signinRequest);
    }

    /**
     * Generates a new access token using a valid refresh token.
     *
     * @param refreshTokenRequest The request containing the refresh token.
     * @return A response containing the new access and refresh tokens.
     */
    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
    }
}
