package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.dto.TokenResponseDto;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.TokenStatus;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the UserService interface for managing user-related operations.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

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

    @Override
    public TokenResponseDto getRequestedToken(Integer user_id) {
        // Fetch all tokens where the user is associated
        List<Token> userTokens = tokenRepository.findByUserId(user_id);

        List<Token> activeTokens =tokenRepository.findAll().stream()
                .filter(token -> token.getStatus().equals(TokenStatus.ACTIVE))
                .collect(Collectors.toList());
        // Log active token IDs
        if (!activeTokens.isEmpty()) {
            activeTokens.forEach(token -> System.out.println("Active Token ID: " + token.getId()));
        } else {
            System.out.println("No active tokens found for the user.");
        }

        // Return both lists in the DTO
        return new TokenResponseDto(userTokens, activeTokens);
    }

    @Override
    public List<Token> tokenHistory(Integer id) {
        return tokenRepository.findByUserId(id);

    }


}
