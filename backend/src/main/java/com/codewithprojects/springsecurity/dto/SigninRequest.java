package com.codewithprojects.springsecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user signin request.
 * Contains necessary fields required for user authentication.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SigninRequest {

    /** Email address of the user */
    private String email;

    /** Password for the user account */
    private String password;
}
