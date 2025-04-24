package com.codewithprojects.springsecurity.exception;

public class TimeSlotConflictException extends RuntimeException {
  public TimeSlotConflictException(String message) {
    super(message);
  }
}
