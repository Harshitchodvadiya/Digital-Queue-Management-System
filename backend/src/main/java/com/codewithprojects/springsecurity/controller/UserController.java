package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import com.codewithprojects.springsecurity.services.Impl.UserServiceImpl;
import com.codewithprojects.springsecurity.services.StaffService;
import com.codewithprojects.springsecurity.services.UserService;
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

    private final UserService userService;
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


    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Update profile by ID
    @PutMapping("/updateProfile/{id}")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUser(id, updatedUser));
    }

}
