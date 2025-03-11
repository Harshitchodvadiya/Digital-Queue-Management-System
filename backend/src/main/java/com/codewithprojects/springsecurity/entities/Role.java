package com.codewithprojects.springsecurity.entities;

/**
 * Enum representing the different roles a user can have in the system.
 */
public enum Role {
    //Regular user (customer) who requests services.
    USER,

    //Admin with full access to manage users, staff, and services.
    ADMIN,

    //Staff member who provides services and manages tokens.
    STAFF
}
