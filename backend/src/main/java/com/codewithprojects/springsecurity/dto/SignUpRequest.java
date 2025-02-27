package com.codewithprojects.springsecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {

    private String firstname;
    private String lastname;
    private String mobileNumber;
    private String email;
    private String password;
}
