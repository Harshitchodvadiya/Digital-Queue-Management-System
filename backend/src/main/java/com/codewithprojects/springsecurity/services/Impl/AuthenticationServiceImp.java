package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.dto.JwtAuthenticationResponse;
import com.codewithprojects.springsecurity.dto.RefreshTokenRequest;
import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.dto.SigninRequest;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.AuthenticationService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImp implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final StaffServicesRepository staffServicesRepository;
    private final JWTService jwtService;

    @Autowired
    HttpServletResponse httpServletResponse;

    public User signup(SignUpRequest signUpRequest, Role role,Integer service_id) {
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setFirstname(signUpRequest.getFirstname());
        user.setSecondname(signUpRequest.getLastname());

        user.setMobileNumber(signUpRequest.getMobileNumber()); // Added mobileNumber
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        // If service_id is 0, set `null`, else fetch the service entity
        StaffServices service = (service_id == 0) ? null :
                staffServicesRepository.findById(Long.valueOf(service_id))
                        .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        user.setService(service);

        return userRepository.save(user);
    }

    public ResponseEntity<JwtAuthenticationResponse> signin(SigninRequest signinRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            var user = userRepository.findByEmail(signinRequest.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);

            // Create HttpOnly Cookie for JWT
            ResponseCookie jwtCookie = ResponseCookie.from("jwtToken", jwtToken)
                    .httpOnly(false)
                    .secure(false)
                    .path("/")
                    .maxAge(86400)  // 1 day expiration
                    .sameSite("Lax")
                    .build();

            // Create HttpOnly Cookie for Refresh Token
            ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(false)
                    .secure(false)
                    .path("/")
                    .maxAge(604800)  // 7 days expiration
                    .sameSite("Lax")
                    .build();

            // Add cookies to response
            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

            // Return response with JWT and refresh token
            JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
            jwtAuthenticationResponse.setToken(jwtToken);
            jwtAuthenticationResponse.setRefreshToken(refreshToken);

            return ResponseEntity.ok(jwtAuthenticationResponse);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

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



    public List<User> getAllStaff() {
        return userRepository.findAll();
    }

    public User updateStaff(Long id, SignUpRequest updateRequest) {


        User staff = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff not found"));


        staff.setFirstname(updateRequest.getFirstname());
        staff.setMobileNumber(updateRequest.getMobileNumber());
        staff.setEmail(updateRequest.getEmail());
        staff.setPassword(updateRequest.getPassword());


        if (updateRequest.getService_id() != null) {
            Optional<StaffServices> optionalService = staffServicesRepository.findById(Long.valueOf(updateRequest.getService_id()));
            if (optionalService.isPresent()) {
                StaffServices service = optionalService.get();
                staff.setService(service);
            } else {
                throw new RuntimeException("Service not found for ID: " + updateRequest.getService_id());
            }
        }

        return userRepository.save(staff);
    }



    public void deleteStaff(Long id){
        User staff = userRepository.findById(id).orElseThrow(()-> new RuntimeException("Staff not found"));

        userRepository.delete(staff);
    }



}
