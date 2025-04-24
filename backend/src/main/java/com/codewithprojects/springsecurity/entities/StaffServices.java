package com.codewithprojects.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

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

    //using @Date the getter and setter will generate isISActive and i've already declared the
    //getter and setter. so the below annotations won't generate getter and setter for isActive
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JsonProperty("isActive")
    
    private boolean isActive; // Indicates if the service is currently active

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

}
