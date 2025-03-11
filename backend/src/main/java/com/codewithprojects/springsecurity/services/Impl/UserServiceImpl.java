package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Implementation of the UserService interface for managing user-related operations.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    /**
     * Loads user details by username (email) for authentication.
     *
     * @return A UserDetailsService implementation that retrieves a user by email.
     */
    @Override
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Finds a user by their unique ID.
     *
     * @param id The ID of the user.
     * @return The user entity if found.
     * @throws NoSuchElementException if the user is not found.
     */
    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Finds a user by their name.
     *
     * @param name The name of the user.
     * @return The user entity if found.
     */
    @Override
    public User findByName(String name) {
        return userRepository.findByEmail(name) // Assuming "findByEmail" was meant instead of recursive call
                .orElseThrow(() -> new UsernameNotFoundException("User not found with name: " + name));
    }
}
