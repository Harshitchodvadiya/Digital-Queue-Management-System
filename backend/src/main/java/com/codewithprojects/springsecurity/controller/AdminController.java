package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthenticationService authenticationService;

    /**
     * Endpoint to check if an admin is authenticated.
     *
     * @return A greeting message indicating admin access.
     */
    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hii, Admin this side ");
    }

    /**
     * Adds a new staff member with the role of STAFF.
     *
     * @param signUpRequest The request containing staff details.
     * @return The created staff user entity.
     */
    @PostMapping("/addStaff")
    public ResponseEntity<?> addStaff(@RequestBody SignUpRequest signUpRequest) {
        return ResponseEntity.ok(authenticationService.signup(signUpRequest, Role.STAFF, signUpRequest.getService_id()));
    }
}
