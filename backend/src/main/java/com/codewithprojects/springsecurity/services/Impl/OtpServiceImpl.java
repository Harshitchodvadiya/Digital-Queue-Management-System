package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.OtpVerification;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.OtpVerificationRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.EmailService;
import com.codewithprojects.springsecurity.services.OtpService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void sendOtp(String email) {
        // Generate a new OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        // Save new OTP
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpVerification.setVerified(false);

        otpVerificationRepository.save(otpVerification);

        // Send the OTP via email
        emailService.sendEmail(email, "Your OTP Code", "Your OTP is: " + otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpVerification> otpRecord = otpVerificationRepository.findByEmailAndOtp(email, otp);
        if (otpRecord.isPresent() && otpRecord.get().getExpiryTime().isAfter(LocalDateTime.now())) {
            OtpVerification otpVerification = otpRecord.get();
            otpVerification.setVerified(true);
            otpVerificationRepository.save(otpVerification);

            // ✅ Send success email after OTP verification
            emailService.sendEmail(
                    email,
                    "OTP Verification Successful",
                    "Hi, your OTP has been successfully verified. You may now reset your password."
            );

            return true;
        }

        return false;
    }

    public boolean resetPassword(String email, String newPassword, String confirmPassword) {
        // Check if newPassword and confirmPassword match
        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("New password and confirm password do not match.");
        }

        Optional<OtpVerification> otpVerified = otpVerificationRepository.findByEmail(email);
        if (otpVerified.isPresent() && otpVerified.get().isVerified()) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            // ✅ Send confirmation email after password reset
            emailService.sendEmail(
                    email,
                    "Password Reset Successful",
                    "Hi, your password has been successfully updated. If this wasn't you, please contact our support immediately."
            );

            // Clean up OTP record
            otpVerificationRepository.delete(otpVerified.get());
            return true;
        }

        return false;
    }

}