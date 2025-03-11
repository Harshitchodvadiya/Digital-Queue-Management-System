package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.dto.UpdateServiceRequest;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;

import java.util.List;

/**
 * Service interface for managing staff-related operations and services.
 */
public interface StaffService {

    /**
     * Adds a new staff service to the system.
     *
     * @param staffService The staff service entity containing service details.
     * @return The added StaffServices entity.
     */
    StaffServices addStaffService(StaffServices staffService);

    /**
     * Retrieves a list of all available staff services.
     *
     * @return A list of StaffServices.
     */
    List<StaffServices> getAllService();

    /**
     * Retrieves a specific staff service by its ID.
     *
     * @param id The ID of the staff service.
     * @return The StaffServices entity if found.
     */
    StaffServices getStaffServiceById(Long id);

    /**
     * Updates an existing staff service based on the provided ID and request data.
     *
     * @param id The ID of the staff service to update.
     * @param updateServiceRequest The request object containing updated service details.
     * @return The updated StaffServices entity.
     */
    StaffServices updateServiceById(Long id, UpdateServiceRequest updateServiceRequest);

    /**
     * Retrieves a list of token requests assigned to a specific staff member.
     *
     * @param id The ID of the staff member.
     * @return A list of Token entities assigned to the staff.
     */
    List<Token> getRequestedToken(Integer id);
}
