package com.codewithprojects.springsecurity.controller;


import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.services.StaffService;
import com.codewithprojects.springsecurity.services.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class StaffServiceController {

    private final StaffService staffService;


    @PostMapping("/addStaffService")
    public ResponseEntity<StaffServices> addStaffService(@RequestBody StaffServices staffServiceRequest) {
        StaffServices createdService = staffService.addStaffService(staffServiceRequest);
        return ResponseEntity.ok(createdService);
    }

    @GetMapping("/getAllService")
    public ResponseEntity<List<StaffServices>> getAllServices() {
        return ResponseEntity.ok(staffService.getAllService());
    }
}

