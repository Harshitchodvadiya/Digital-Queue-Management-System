package com.codewithprojects.springsecurity.services;

public interface OtpService {
    void sendOtp(String email);
    boolean verifyOtp(String email, String otp);
    boolean resetPassword(String email, String newPassword);
}
