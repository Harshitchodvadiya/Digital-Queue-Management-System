package com.codewithprojects.springsecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user signup request.
 * Contains necessary fields required for user registration.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {

    /** First name of the user */
    private String firstname;

    /** Last name of the user */
    private String lastname;

    /** ID of the service assigned to the user (if applicable) */
    private Integer service_id;

    /** Mobile number of the user */
    private String mobileNumber;

    /** Email address of the user */
    private String email;

    /** Password for the user account */
    private String password;
}
