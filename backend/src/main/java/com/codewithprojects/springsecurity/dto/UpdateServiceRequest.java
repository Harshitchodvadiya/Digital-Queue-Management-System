package com.codewithprojects.springsecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating service details.
 * Contains fields required for modifying an existing service.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateServiceRequest {

    /** The name of the service */
    private String serviceName;

    /** A brief description of the service */
    private String serviceDescription;

    /** Estimated time in minutes required to complete the service */
    private int estimatedTime;

    /** Indicates whether the service is active or not */
    private boolean isActive;
}
