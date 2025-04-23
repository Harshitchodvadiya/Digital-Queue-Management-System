package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.dto.UpdateServiceRequest;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class StaffServiceController {

    private final StaffService staffService;

    /**
     * Adds a new staff service.
     *
     * @param staffServiceRequest The details of the staff service to be added.
     * @return The created staff service.
     */
    @PostMapping("/addStaffService")
    public ResponseEntity<StaffServices> addStaffService(@RequestBody StaffServices staffServiceRequest) {
        StaffServices createdService = staffService.addStaffService(staffServiceRequest);
        return ResponseEntity.ok(createdService);
    }

    /**
     * Retrieves a list of all available staff services.
     *
     * @return A list of all staff services.
     */
    @GetMapping("/getAllService")
    public ResponseEntity<List<StaffServices>> getAllServices() {
        return ResponseEntity.ok(staffService.getAllService());
    }

    /**
     * Updates an existing staff service by its ID.
     *
     * @param id              The ID of the staff service to be updated.
     * @param updateServiceRequest The updated details of the staff service.
     * @return The updated staff service.
     */
    @PutMapping("/updateService/{id}")
    public ResponseEntity<StaffServices> updateService(@PathVariable Long id, @RequestBody UpdateServiceRequest updateServiceRequest) {
        return ResponseEntity.ok(staffService.updateServiceById(id, updateServiceRequest));
    }
}
