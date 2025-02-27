package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.dto.JwtAuthenticationResponse;
import com.codewithprojects.springsecurity.dto.RefreshTokenRequest;
import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.dto.SigninRequest;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import org.springframework.http.ResponseEntity;


import java.util.List;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest, Role role);
    ResponseEntity<JwtAuthenticationResponse> signin(SigninRequest signinRequest);
    JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
    List<User> getAllStaff(); // Added method

}