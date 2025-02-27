package com.codewithprojects.springsecurity.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Hii, User this side ");
    }
}
