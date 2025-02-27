package com.codewithprojects.springsecurity.controller;


import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")

@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthenticationService authenticationService;

    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Hii, Admin this side ");
    }

    @PostMapping("/addStaff")
    public ResponseEntity<?> addStaff(@RequestBody SignUpRequest signUpRequest){
//        System.out.println(signUpRequest.getFirstname());
        return ResponseEntity.ok(authenticationService.signup(signUpRequest, Role.STAFF ));
    }

    @GetMapping("/staffList")
    public ResponseEntity<List<User>> getAllStaff(){
        return ResponseEntity.ok(authenticationService.getAllStaff());
    }
}
