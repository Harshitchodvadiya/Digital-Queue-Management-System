package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.dto.*;
import com.codewithprojects.springsecurity.entities.OtpVerification;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import com.codewithprojects.springsecurity.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @Autowired
    private OtpService otpService;

    /**
     * Registers a new user with the default role as USER.
     *
     * @param signUpRequest The sign-up request containing user details.
     * @return The registered user entity.
     */
//    @PostMapping("/signup")
//    public ResponseEntity<User> signup(@RequestBody SignUpRequest signUpRequest) {
//        Integer service_id;
//        return ResponseEntity.ok(authenticationService.signup(signUpRequest, Role.USER, service_id = 0));
//    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequest request) {
        User user = authenticationService.signup(request, Role.USER, 0); // pass role and service_id as needed
        return ResponseEntity.ok("Signup successful. Please verify OTP sent to email.");
    }

//    @PostMapping("/verify-signup-otp")
//    public ResponseEntity<?> verifySignupOtp(@RequestParam String email, @RequestParam String otp) {
//        boolean verified = authenticationService.verifySignupOtp(email, otp);
//        if (verified) {
//            return ResponseEntity.ok("Account verified successfully.");
//        }
//        return ResponseEntity.badRequest().body("Invalid or expired OTP.");
//    }

    @PostMapping("/verify-signup-otp")
    public ResponseEntity<?> verifySignupOtp(@RequestBody OtpVerification request) {
        boolean verified = authenticationService.verifySignupOtp(request.getEmail(), request.getOtp());
        if (verified) {
            return ResponseEntity.ok("Account verified successfully.");
        }
        return ResponseEntity.badRequest().body("Invalid or expired OTP.");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean resent = authenticationService.resendOtp(email);
        return resent ? ResponseEntity.ok("OTP resent.") : ResponseEntity.badRequest().body("Failed to resend OTP.");
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

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        otpService.sendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail
                (), request.getOtp());
        return isValid ? ResponseEntity.ok("OTP Verified")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean isReset = otpService.resetPassword(request.getEmail(), request.getNewPassword());
        return isReset ? ResponseEntity.ok("Password Reset Successful")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Reset failed. Verify OTP first.");
    }
}
