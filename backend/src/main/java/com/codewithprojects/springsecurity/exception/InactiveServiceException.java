package com.codewithprojects.springsecurity.exception;

public class InactiveServiceException extends RuntimeException {
    public InactiveServiceException(String message) {
        super(message);
    }
}
