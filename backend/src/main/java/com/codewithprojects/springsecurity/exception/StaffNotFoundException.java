package com.codewithprojects.springsecurity.exception;

public class StaffNotFoundException extends RuntimeException {
    public StaffNotFoundException(Long id) {
        super("Staff not found with id: " + id);
    }
}
