package com.codewithprojects.springsecurity.dto;

import lombok.Data;

/**
 * DTO for sending JWT authentication response.
 * Contains the access token and refresh token for authentication.
 */
@Data
public class JwtAuthenticationResponse {

    /** The JWT access token used for authentication */
    private String token;

    /** The refresh token used to obtain a new access token */
    private String refreshToken;
}
