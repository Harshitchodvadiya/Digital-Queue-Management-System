package com.codewithprojects.springsecurity.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a service provided by staff members.
 * Each service has a name, description, estimated time, and active status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "staff_services")
public class StaffServices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId; // Unique identifier for the service

    private String serviceName; // Name of the service provided by staff
    private String serviceDescription; // Detailed description of the service
    private int estimatedTime; // Estimated time (in minutes) required for the service
    private boolean isActive; // Indicates if the service is currently active
}
