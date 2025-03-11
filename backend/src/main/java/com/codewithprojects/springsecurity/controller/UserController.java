package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import com.codewithprojects.springsecurity.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final StaffService staffService;
    private final AuthenticationService authenticationService;

    /**
     * Endpoint to test API availability.
     * @return A simple greeting message.
     */
    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hii, User this side");
    }

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
}
