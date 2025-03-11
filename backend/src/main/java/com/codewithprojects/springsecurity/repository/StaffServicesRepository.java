package com.codewithprojects.springsecurity.repository;

import com.codewithprojects.springsecurity.entities.StaffServices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing StaffServices entities.
 * Extends JpaRepository to provide CRUD operations.
 */
@Repository
public interface StaffServicesRepository extends JpaRepository<StaffServices, Long> {

    /**
     * Retrieves all staff services available in the database.
     *
     * @return List of all StaffServices entities.
     */
    List<StaffServices> findAll();
}
