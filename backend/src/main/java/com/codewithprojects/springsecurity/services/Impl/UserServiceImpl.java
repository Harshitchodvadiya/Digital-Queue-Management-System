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
import java.time.LocalDate;
import java.util.*;
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

        // Filter tokens for today's date with PENDING or ACTIVE status
        LocalDate today = LocalDate.now();
        List<Token> activeTokens = tokenRepository.findAll().stream()
                .filter(token ->
                        (token.getStatus().equals(TokenStatus.ACTIVE) ||
                                token.getStatus().equals(TokenStatus.PENDING)) &&
                                token.getIssuedTime().toLocalDate().equals(today)) // Filter by today's date
                .collect(Collectors.toList());

        // Group tokens by Service ID
        Map<Long, List<Token>> serviceTokensMap = activeTokens.stream()
                .collect(Collectors.groupingBy(token -> token.getStaffId().getService().getServiceId()));

        // Map to track current token for each service
        Map<Long, Token> currentTokenMap = new HashMap<>();

        // Map to track people ahead for each user's token
        Map<Long, Integer> peopleAheadMap = new HashMap<>();

        // Iterate through each service
        for (Map.Entry<Long, List<Token>> entry : serviceTokensMap.entrySet()) {
            List<Token> serviceTokens = entry.getValue();

            // Sort tokens by issued time for correct queue order
            serviceTokens.sort(Comparator.comparing(Token::getIssuedTime));

            // Identify the current token for the service (First ACTIVE token)
            Token currentToken = serviceTokens.stream()
                    .filter(token -> token.getStatus().equals(TokenStatus.ACTIVE))
                    .findFirst()
                    .orElse(null);

            currentTokenMap.put(entry.getKey(), currentToken);

            // Calculate 'people ahead' for each user's token in each service
            int count = 0;
            for (Token token : serviceTokens) {
                if (token.getStatus().equals(TokenStatus.PENDING)) {
                    peopleAheadMap.put(token.getId(), count);
                    count++; // Increment count only for PENDING tokens
                }
            }
        }

        return new TokenResponseDto(userTokens, new ArrayList<>(currentTokenMap.values()), peopleAheadMap);
    }

    @Override
    public List<Token> tokenHistory(Integer id) {
        return tokenRepository.findByUserId(id);

    }
}
