package com.codewithprojects.springsecurity.repository;

import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing User entities.
 * Extends JpaRepository to provide CRUD operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their email.
     *
     * @param email The email of the user.
     * @return An Optional containing the user if found, otherwise empty.
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a single user by their role.
     *
     * @param role The role of the user.
     * @return The user with the specified role.
     */
    User findByRole(Role role);

    /**
     * Retrieves all users with a specific role.
     *
     * @param role The role to filter users by.
     * @return A list of users with the given role.
     */
    List<User> findAllByRole(Role role);

    /**
     * Finds a user by their mobile number.
     *
     * @param mobileNumber The mobile number of the user.
     * @return An Optional containing the user if found, otherwise empty.
     */
    Optional<User> findByMobileNumber(String mobileNumber);
}
