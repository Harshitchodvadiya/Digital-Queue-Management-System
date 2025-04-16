package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.dto.TokenResponseDto;
import com.codewithprojects.springsecurity.dto.UserDto;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

/**
 * Service interface for handling user-related operations.
 */
public interface UserService {

    /**
     * Provides the UserDetailsService implementation for authentication and security.
     *
     * @return A UserDetailsService instance for loading user details.
     */
    UserDetailsService userDetailsService();

    /**
     * Finds a user by their unique ID.
     *
     * @param id The ID of the user.
     * @return The User entity if found.
     */
    User findUserById(Long id);

    /**
     * Finds a user by their name.
     *
     * @param name The name of the user.
     * @return The User entity if found.
     */
    User findByName(String name);

    TokenResponseDto getRequestedToken(Integer id);

    List<Token> tokenHistory(Integer id);

    User getUserById(Long id);
    User updateUser(Long id, UserDto updatedUserDto);
}
