package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.dto.UpdateServiceRequest;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.services.StaffService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of the StaffService interface.
 * Provides methods to manage staff services and handle tokens.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffServicesRepository staffServicesRepository;
    private final TokenServiceImpl tokenServiceImpl;

    /**
     * Adds a new staff service to the system.
     *
     * @param staffService The staff service to be added.
     * @return The saved StaffServices entity.
     */
    @Override
    public StaffServices addStaffService(StaffServices staffService) {
        return staffServicesRepository.save(staffService);
    }

    /**
     * Retrieves all available staff services.
     *
     * @return A list of all staff services.
     */
    @Override
    public List<StaffServices> getAllService() {
        return staffServicesRepository.findAll();
    }

    /**
     * Retrieves a specific staff service by its ID.
     *
     * @param id The ID of the staff service.
     * @return The StaffServices entity if found.
     * @throws RuntimeException if the service is not found.
     */
    @Override
    public StaffServices getStaffServiceById(Long id) {
        return staffServicesRepository.findById(id).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    /**
     * Updates an existing staff service based on the provided ID.
     *
     * @param id                   The ID of the service to be updated.
     * @param updateServiceRequest The DTO containing the updated service details.
     * @return The updated StaffServices entity.
     * @throws RuntimeException if the service is not found.
     */
    public StaffServices updateServiceById(Long id, UpdateServiceRequest updateServiceRequest) {
        StaffServices services = staffServicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Update service details
        services.setServiceName(updateServiceRequest.getServiceName());
        services.setServiceDescription(updateServiceRequest.getServiceDescription());
        services.setEstimatedTime(updateServiceRequest.getEstimatedTime());
        services.setActive(updateServiceRequest.isActive());

        return staffServicesRepository.save(services);
    }

    /**
     * Retrieves all requested tokens associated with a specific staff member.
     *
     * @param user_id The ID of the staff member.
     * @return A list of Token entities assigned to the staff member.
     */
    @Override
    public List<Token> getRequestedToken(Integer user_id) {
        List<Token> tokens = tokenServiceImpl.getAllRequestedToken();
        log.info("Requested Token is: "+tokens);
//        System.out.println(tokens);

        // Filter tokens for the given staff ID
        return tokens.stream()
                .filter(token -> token.getStaffId().getId().equals(user_id))
                .toList();
    }
}
