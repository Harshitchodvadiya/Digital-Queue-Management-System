package com.codewithprojects.springsecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for handling refresh token requests.
 * Contains the refresh token needed to generate a new access token.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenRequest {

    /** The refresh token used to obtain a new JWT access token */
    private String token;
}
