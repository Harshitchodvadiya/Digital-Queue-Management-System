//package com.codewithprojects.springsecurity.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//@RestControllerAdvice
//public class RestExceptionHandler {
//
//    @ExceptionHandler(InvalidTokenException.class)
//    public ResponseEntity<String> handleInvalidToken(InvalidTokenException ex) {
//        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
//    }
//
//    @ExceptionHandler(InactiveServiceException.class)
//    public ResponseEntity<String> handleInactiveService(InactiveServiceException ex) {
//        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
//    }
//
//    @ExceptionHandler(TimeSlotConflictException.class)
//    public ResponseEntity<String> handleConflict(TimeSlotConflictException ex) {
//        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
//    }
//
//    // NEW: Password validation mismatch
//    @ExceptionHandler(ValidationException.class)
//    public ResponseEntity<String> handleValidation(ValidationException ex) {
//        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
//    }
//
//    // NEW: OTP-related problems
//    @ExceptionHandler(OtpException.class)
//    public ResponseEntity<String> handleOtpError(OtpException ex) {
//        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
//    }
//
//    // NEW: Entity not found (e.g. User or other records)
//    @ExceptionHandler(EntityNotFoundException.class)
//    public ResponseEntity<String> handleNotFound(EntityNotFoundException ex) {
//        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
//    }
//
//    // Fallback for all other unchecked exceptions
//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<String> handleGeneric(RuntimeException ex) {
//        // You might log ex here
//        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
//                "An unexpected error occurred.");
//    }
//
//    private ResponseEntity<String> buildResponse(HttpStatus status, String body) {
//        return ResponseEntity.status(status).body(body);
//    }
//}



package com.codewithprojects.springsecurity.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.authentication.BadCredentialsException;

@RestControllerAdvice
public class RestExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(RestExceptionHandler.class);

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<String> handleInvalidToken(InvalidTokenException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(InactiveServiceException.class)
    public ResponseEntity<String> handleInactiveService(InactiveServiceException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(TimeSlotConflictException.class)
    public ResponseEntity<String> handleConflict(TimeSlotConflictException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<String> handleValidation(ValidationException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(OtpException.class)
    public ResponseEntity<String> handleOtpError(OtpException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(StaffNotFoundException.class)
    public ResponseEntity<String> handleStaffNotFound(StaffNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ServiceNotFoundException.class)
    public ResponseEntity<String> handleServiceNotFound(ServiceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(UserNotFoundException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
    }

    // Fallback for all other unchecked exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleGeneric(RuntimeException ex) {
        log.error("Unhandled exception caught:", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
    }

    private ResponseEntity<String> buildResponse(HttpStatus status, String body) {
        return ResponseEntity.status(status).body(body);
    }
}
