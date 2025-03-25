package com.codewithprojects.springsecurity.entities;

/**
 * Enum representing the possible statuses of a token in the system.
 */
public enum TokenStatus {
    // Token is generated but not yet processed.
    PENDING,
    // Token is currently being processed.
    ACTIVE,
    //Token has been successfully completed.
    COMPLETED,
    //Token was skipped (e.g., user did not show up).
    SKIPPED,
    CANCELLED
}
