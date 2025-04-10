package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.OtpVerification;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.OtpVerificationRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.EmailService;
import com.codewithprojects.springsecurity.services.OtpService;
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
    public void sendOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        otpVerification.setVerified(false);

        otpVerificationRepository.save(otpVerification);
        emailService.sendEmail(email, "Your OTP Code", "Your OTP is: " + otp);
    }

//    @Override
//    public boolean verifyOtp(String email, String otp) {
//        Optional<OtpVerification> otpRecord = otpVerificationRepository.findByEmailAndOtp(email, otp);
//        if (otpRecord.isPresent() && otpRecord.get().getExpiryTime().isAfter(LocalDateTime.now())) {
//            OtpVerification otpVerification = otpRecord.get();
//            otpVerification.setVerified(true);
//            otpVerificationRepository.save(otpVerification);
//            return true;
//        }
//        return false;
//    }
//
//    @Override
//    public boolean resetPassword(String email, String newPassword) {
//        Optional<OtpVerification> otpVerified = otpVerificationRepository.findByEmail(email);
//        if (otpVerified.isPresent() && otpVerified.get().isVerified()) {
//            User user = userRepository.findByEmail(email)
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//            user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
//            userRepository.save(user);
//
//            otpVerificationRepository.delete(otpVerified.get());
//            return true;
//        }
//        return false;
//    }

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

    @Override
    public boolean resetPassword(String email, String newPassword) {
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