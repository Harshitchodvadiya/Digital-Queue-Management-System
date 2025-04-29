package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.dto.JwtAuthenticationResponse;
import com.codewithprojects.springsecurity.dto.RefreshTokenRequest;
import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.dto.SigninRequest;
import com.codewithprojects.springsecurity.entities.OtpVerification;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.exception.BadCredentialsException;
import com.codewithprojects.springsecurity.exception.ServiceNotFoundException;
import com.codewithprojects.springsecurity.exception.StaffNotFoundException;
import com.codewithprojects.springsecurity.exception.UserNotFoundException;
import com.codewithprojects.springsecurity.repository.OtpVerificationRepository;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import com.codewithprojects.springsecurity.services.EmailService;
import com.codewithprojects.springsecurity.services.JWTService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImp implements AuthenticationService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final StaffServicesRepository staffServicesRepository;
    private final JWTService jwtService;

    @Autowired
    HttpServletResponse httpServletResponse;

    private final OtpVerificationRepository otpVerificationRepository;
    private final EmailService emailService;

    /**
     * Registers a new user with the given role and associated service.
     * @param signUpRequest The signup request containing user details.
     * @param role The role assigned to the user.
     * @param service_id The service ID assigned to the user (nullable for non-staff users).
     * @return The saved user entity.
     */
//    public User signup(SignUpRequest signUpRequest, Role role, Integer service_id) {
//        User user = new User();
//        user.setEmail(signUpRequest.getEmail());
//        user.setFirstname(signUpRequest.getFirstname());
//        user.setSecondname(signUpRequest.getLastname());
//        user.setMobileNumber(signUpRequest.getMobileNumber());
//        user.setRole(role);
//        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
//
//        // If service_id is 0, set `null`, else fetch the service entity
//        StaffServices service = (service_id == 0) ? null :
//                staffServicesRepository.findById(Long.valueOf(service_id))
//                        .orElseThrow(() -> new IllegalArgumentException("Service not found"));
//
//        user.setService(service);
//
//        return userRepository.save(user);
//    }

    public User signup(SignUpRequest signUpRequest, Role role, Integer service_id) {
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setFirstname(signUpRequest.getFirstname());
        user.setSecondname(signUpRequest.getLastname());
        user.setMobileNumber(signUpRequest.getMobileNumber());
        user.setRole(role);
        user.setEnabled(false); // Not verified yet
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        StaffServices service = (service_id == 0) ? null :
                staffServicesRepository.findById(Long.valueOf(service_id))
                        .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        user.setService(service);
        userRepository.save(user);

        // 🔐 Generate OTP and store it
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(user.getEmail());
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        otpVerification.setVerified(false);
        otpVerificationRepository.save(otpVerification);

        // 📧 Send OTP email
        emailService.sendEmail(
                user.getEmail(),
                "Verify your account - OTP",
                "Your OTP for account verification is: " + otp
        );

        return user;
    }

    public boolean verifySignupOtp(String email, String otp) {
        Optional<OtpVerification> record = otpVerificationRepository.findByEmailAndOtp(email, otp);
        if (record.isPresent() && record.get().getExpiryTime().isAfter(LocalDateTime.now())) {
            record.get().setVerified(true);
            otpVerificationRepository.save(record.get());

            // ✅ Activate user
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setEnabled(true);
            userRepository.save(user);

            // ✉️ Send welcome email
            emailService.sendEmail(
                    email,
                    "Account Verified",
                    "Welcome! Your account has been successfully verified."
            );

            return true;
        }
        return false;
    }

    public boolean resendOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        // Create new OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpVerification.setVerified(false);
        otpVerificationRepository.save(otpVerification);

        emailService.sendEmail(email, "Resend OTP", "Your new OTP is: " + otp);
        return true;
    }


    /**
     * Authenticates a user and generates JWT and refresh tokens.
     * @param signinRequest The sign-in request containing user credentials.
     * @return ResponseEntity containing JWT authentication response with tokens.
     */

//    public ResponseEntity<JwtAuthenticationResponse> signin(SigninRequest signinRequest) {
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword())
//        );
//
//        if (authentication.isAuthenticated()) {
//            var user = userRepository.findByEmail(signinRequest.getEmail())
//                    .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
//
//            String jwtToken = jwtService.generateToken(user);
//            String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);
//
//            // Create HttpOnly Cookie for JWT
//            ResponseCookie jwtCookie = ResponseCookie.from("jwtToken", jwtToken)
//                    .httpOnly(false)
//                    .secure(false) // sent over http and https
//                    .path("/") //cookie available for all the paths
//                    .maxAge(86400)  // 1 day expiration
//                    .sameSite("Lax")
//                    .build();
//
//            // Create HttpOnly Cookie for Refresh Token
//            ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
//                    .httpOnly(false)
//                    .secure(false)
//                    .path("/")
//                    .maxAge(604800)  // 7 days expiration
//                    .sameSite("Lax")
//                    .build();
//
//            // Add cookies to response
//            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
//            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
//
//            // Return response with JWT and refresh token
//            JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
//            jwtAuthenticationResponse.setToken(jwtToken);
//            jwtAuthenticationResponse.setRefreshToken(refreshToken);
//
//            return ResponseEntity.ok(jwtAuthenticationResponse);
//        }
//
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//    }

    public ResponseEntity<JwtAuthenticationResponse> signin(SigninRequest signinRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(signinRequest.getEmail());

        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not registered. Please register first.");
        }

        User user = optionalUser.get();

        if (!user.isEnabled()) {
            // User has not verified OTP
            throw new RuntimeException("Account not verified. Please register or verify your OTP.");
        }
//
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword())
//        );

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword())
            );
            if (authentication.isAuthenticated()) {
                String jwtToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);

                ResponseCookie jwtCookie = ResponseCookie.from("jwtToken", jwtToken)
                        .httpOnly(false)
                        .secure(false)
                        .path("/")
                        .maxAge(86400)
                        .sameSite("Lax")
                        .build();

                ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                        .httpOnly(false)
                        .secure(false)
                        .path("/")
                        .maxAge(604800)
                        .sameSite("Lax")
                        .build();

                httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
                httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

                JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
                jwtAuthenticationResponse.setToken(jwtToken);
                jwtAuthenticationResponse.setRefreshToken(refreshToken);

                return ResponseEntity.ok(jwtAuthenticationResponse);
            }

        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials detected");
            throw e;  // Rethrow the exception to be caught by the handler
        }



        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    /**
     * Refreshes an expired JWT token using a valid refresh token.
     * @param refreshTokenRequest The refresh token request containing the old token.
     * @return A new JWT authentication response with a refreshed token.
     */
    public JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String userEmail = jwtService.extractUserName(refreshTokenRequest.getToken());
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        if (jwtService.isTokenValid(refreshTokenRequest.getToken(), user)) {
            var jwt = jwtService.generateToken(user);

            JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
            jwtAuthenticationResponse.setToken(jwt);
            jwtAuthenticationResponse.setRefreshToken(refreshTokenRequest.getToken());

            return jwtAuthenticationResponse;
        }
        return null;
    }

    /**
     * Retrieves a list of all staff members.
     * @return List of all staff users.
     */
    public List<User> getAllStaff() {
        return userRepository.findAll();
    }

    /**
     * Updates staff details, including assigned service if provided.
     * @param id The ID of the staff member to update.
     * @param updateRequest The request containing updated details.
     * @return The updated staff user.
     */
//    public User updateStaff(Long id, SignUpRequest updateRequest) {
//        User staff = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff not found"));
//
//        staff.setFirstname(updateRequest.getFirstname());
//        staff.setMobileNumber(updateRequest.getMobileNumber());
//        staff.setEmail(updateRequest.getEmail());
//        staff.setPassword(updateRequest.getPassword());
//
//        if (updateRequest.getService_id() != null) {
//            Optional<StaffServices> optionalService = staffServicesRepository.findById(Long.valueOf(updateRequest.getService_id()));
//            if (optionalService.isPresent()) {
//                StaffServices service = optionalService.get();
//                staff.setService(service);
//            } else {
//                throw new RuntimeException("Service not found for ID: " + updateRequest.getService_id());
//            }
//        }
//
//        return userRepository.save(staff);
//    }

    public User updateStaff(Long id, SignUpRequest updateRequest) {
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException(id));

        staff.setFirstname(updateRequest.getFirstname());
        staff.setMobileNumber(updateRequest.getMobileNumber());
        staff.setEmail(updateRequest.getEmail());
        staff.setPassword(updateRequest.getPassword());

        if (updateRequest.getService_id() != null) {
            Long serviceId = Long.valueOf(updateRequest.getService_id());
            StaffServices service = staffServicesRepository.findById(serviceId)
                    .orElseThrow(() -> new ServiceNotFoundException(serviceId));
            staff.setService(service);
        }

        return userRepository.save(staff);
    }

    /**
     * Deletes a staff member by ID.
     * @param id The ID of the staff member to delete.
     */
    public void deleteStaff(Long id) {
        User staff = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff not found"));
        userRepository.delete(staff);
    }
}
