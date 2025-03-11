package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.dto.SignUpRequest;
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
public class StaffController {

    private final AuthenticationService authenticationService;

    /**
     * Retrieves a list of all users, including Admin, Staff, and regular Users.
     *
     * @return A list of all users.
     */
    @GetMapping("/userList")
    public ResponseEntity<List<User>> getAllStaff() {
        return ResponseEntity.ok(authenticationService.getAllStaff());
    }

    /**
     * Updates the details of an existing staff member.
     *
     * @param id            The ID of the staff member to update.
     * @param updateRequest The updated staff details.
     * @return The updated user entity.
     */
    @PutMapping("/updateStaff/{id}")
    public ResponseEntity<User> updateStaff(@PathVariable Long id, @RequestBody SignUpRequest updateRequest) {
        return ResponseEntity.ok(authenticationService.updateStaff(id, updateRequest));
    }

    /**
     * Deletes a staff member based on their ID.
     *
     * @param id The ID of the staff member to delete.
     * @return A success message confirming deletion.
     */
    @DeleteMapping("/deleteStaff/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Long id) {
        authenticationService.deleteStaff(id);
        return ResponseEntity.ok("Staff deleted Successfully");
    }
}
