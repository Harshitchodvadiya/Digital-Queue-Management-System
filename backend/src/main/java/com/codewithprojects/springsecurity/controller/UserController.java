package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import com.codewithprojects.springsecurity.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final StaffService staffService;
    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;


    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    /**
     * Retrieves a list of all available services.
     * @return A ResponseEntity containing a list of StaffServices.
     */
    @GetMapping("/getAllService")
    public ResponseEntity<List<StaffServices>> getAllServices() {
        return ResponseEntity.ok(staffService.getAllService());
    }

    /**
     * Retrieves a list of all registered users (staff members).
     * @return A ResponseEntity containing a list of Users.
     */
    @GetMapping("/userList")
    public ResponseEntity<List<User>> getAllStaff() {
        return ResponseEntity.ok(authenticationService.getAllStaff());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestBody User updatedUser, Authentication authentication) {
        String currentEmail = authentication.getName();  // This is from JWT token
        User user = userRepository.findByEmail(currentEmail).orElseThrow();

        boolean emailChanged = !user.getEmail().equals(updatedUser.getEmail());

        user.setFirstname(updatedUser.getFirstname());
        user.setSecondname(updatedUser.getSecondname());
        user.setMobileNumber(updatedUser.getMobileNumber());

        if (emailChanged) {
            user.setEmail(updatedUser.getEmail()); // update email
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        userRepository.save(user);

        // Optional: if email changed, ask frontend to logout and login again
        if (emailChanged) {
            return ResponseEntity.ok("Profile updated successfully! Please re-login with your new email.");
        }

        return ResponseEntity.ok("Profile updated successfully!");
    }




}
