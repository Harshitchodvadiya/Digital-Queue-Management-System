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

//    @Override
//    public TokenResponseDto getRequestedToken(Integer user_id) {
//        // Fetch all tokens where the user is associated
//        List<Token> userTokens = tokenRepository.findByUserId(user_id);
//
//        // Fetch all tokens from the database
//        List<Token> allTokens = tokenRepository.findAll();
//
//        // Group tokens by Service ID and Date (Ensuring future dates are considered separately)
//        Map<Long, Map<LocalDate, List<Token>>> serviceDateTokensMap = allTokens.stream()
//                .collect(Collectors.groupingBy(
//                        token -> token.getStaffId().getService().getServiceId(),
//                        Collectors.groupingBy(token -> token.getIssuedTime().toLocalDate())
//                ));
//
//        // Map to track the current active token for each service on each date
//        Map<String, Token> currentTokenMap = new HashMap<>(); // Key format: "serviceId_date"
//
//        // Map to track people ahead for each user's token
//        Map<Long, Integer> peopleAheadMap = new HashMap<>();
//
//        // Iterate through each service
//        for (Map.Entry<Long, Map<LocalDate, List<Token>>> serviceEntry : serviceDateTokensMap.entrySet()) {
//            Long serviceId = serviceEntry.getKey();
//            Map<LocalDate, List<Token>> dateTokensMap = serviceEntry.getValue();
//
//            // Iterate through each date
//            for (Map.Entry<LocalDate, List<Token>> dateEntry : dateTokensMap.entrySet()) {
//                LocalDate tokenDate = dateEntry.getKey();
//                List<Token> serviceTokens = dateEntry.getValue();
//
//                // Sort tokens by issued time (FIFO queue)
//                serviceTokens.sort(Comparator.comparing(Token::getIssuedTime));
//
//                // Identify the first ACTIVE token for the service on this date
//                Token currentToken = serviceTokens.stream()
//                        .filter(token -> token.getStatus().equals(TokenStatus.ACTIVE))
//                        .findFirst()
//                        .orElse(null);
//
//                // Store current token separately for each service + date
//                String key = serviceId + "_" + tokenDate; // Unique key for service and date
//                currentTokenMap.put(key, currentToken);
//
//                // Calculate 'people ahead' for each user's token in each service for this specific date
//                int count = 0;
//                for (Token token : serviceTokens) {
//                    if (token.getStatus().equals(TokenStatus.PENDING)) {
//                        peopleAheadMap.put(token.getId(), count);
//                        count++; // Increment count only for PENDING tokens
//                    }
//                }
//            }
//        }
//
//        return new TokenResponseDto(userTokens, new ArrayList<>(currentTokenMap.values()), peopleAheadMap);
//    }


//    @Override
//    public TokenResponseDto getRequestedToken(Integer user_id) {
//        // Fetch all tokens where the user is associated
//        List<Token> userTokens = tokenRepository.findByUserId(user_id);
//
//        // Fetch all tokens from the database
//        List<Token> allTokens = tokenRepository.findAll();
//
//        // Group tokens by (Service ID, Staff ID, Date)
//        Map<Long, Map<Long, Map<LocalDate, List<Token>>>> serviceStaffDateTokensMap = allTokens.stream()
//                .collect(Collectors.groupingBy(
//                        token -> token.getStaffId().getService().getServiceId(), // Get Service ID
//                        Collectors.groupingBy(
//                                token -> Long.valueOf(token.getStaffId().getId()), // Get Staff ID
//                                Collectors.groupingBy(token -> token.getIssuedTime().toLocalDate()) // Group by date
//                        )
//                ));
//
//        // Map to track the current active token for each (Service ID, Staff ID, Date)
//        Map<String, Token> currentTokenMap = new HashMap<>(); // Key format: "serviceId_staffId_date"
//
//        // Map to track people ahead for each user's token
//        Map<Long, Integer> peopleAheadMap = new HashMap<>();
//
//        // Iterate through each service
//        for (Map.Entry<Long, Map<Long, Map<LocalDate, List<Token>>>> serviceEntry : serviceStaffDateTokensMap.entrySet()) {
//            Long serviceId = serviceEntry.getKey();
//            Map<Long, Map<LocalDate, List<Token>>> staffDateTokensMap = serviceEntry.getValue();
//
//            // Iterate through each staff member under the service
//            for (Map.Entry<Long, Map<LocalDate, List<Token>>> staffEntry : staffDateTokensMap.entrySet()) {
//                Long staffId = staffEntry.getKey();
//                Map<LocalDate, List<Token>> dateTokensMap = staffEntry.getValue();
//
//                // Iterate through each date
//                for (Map.Entry<LocalDate, List<Token>> dateEntry : dateTokensMap.entrySet()) {
//                    LocalDate tokenDate = dateEntry.getKey();
//                    List<Token> staffTokens = dateEntry.getValue();
//
//                    // Sort tokens by issued time (FIFO queue)
//                    staffTokens.sort(Comparator.comparing(Token::getIssuedTime));
//
//                    // Identify the first ACTIVE token for this (Service ID, Staff ID, Date)
//                    Token currentToken = staffTokens.stream()
//                            .filter(token -> token.getStatus().equals(TokenStatus.ACTIVE))
//                            .findFirst()
//                            .orElse(null);
//
//                    // Store current token separately for each (Service ID, Staff ID, Date)
//                    String key = serviceId + "_" + staffId + "_" + tokenDate;
//                    currentTokenMap.put(key, currentToken);
//
//                    // Calculate 'people ahead' for each user's token under this specific (Service ID, Staff ID, Date)
//                    int count = 0;
//                    for (Token token : staffTokens) {
//                        if (token.getStatus().equals(TokenStatus.PENDING)) {
//                            peopleAheadMap.put(token.getId(), count);
//                            count++; // Increment count only for PENDING tokens
//                        }
//                    }
//                }
//            }
//        }
//
//        return new TokenResponseDto(userTokens, new ArrayList<>(currentTokenMap.values()), peopleAheadMap);
//    }


    @Override
    public TokenResponseDto getRequestedToken(Integer user_id) {
        // Fetch all tokens where the user is associated
        List<Token> userTokens = tokenRepository.findByUserId(user_id);

        // Fetch all tokens from the database
        List<Token> allTokens = tokenRepository.findAll();

        // Group tokens by (Service ID, Staff ID, Date)
        Map<Long, Map<Long, Map<LocalDate, List<Token>>>> serviceStaffDateTokensMap = allTokens.stream()
                .collect(Collectors.groupingBy(
                        token -> token.getStaffId().getService().getServiceId(), // Get Service ID
                        Collectors.groupingBy(
                                token -> Long.valueOf(token.getStaffId().getId()), // Get Staff ID
                                Collectors.groupingBy(token -> token.getIssuedTime().toLocalDate()) // Group by date
                        )
                ));

        // Map to track the current active token for each (Service ID, Staff ID, Date)
        Map<String, Token> currentTokenMap = new HashMap<>(); // Key format: "serviceId_staffId_date"

        // Map to track people ahead for each user's token
        Map<Long, Integer> peopleAheadMap = new HashMap<>();

        // Iterate through each service
        for (Map.Entry<Long, Map<Long, Map<LocalDate, List<Token>>>> serviceEntry : serviceStaffDateTokensMap.entrySet()) {
            Long serviceId = serviceEntry.getKey();
            Map<Long, Map<LocalDate, List<Token>>> staffDateTokensMap = serviceEntry.getValue();

            // Iterate through each staff member under the service
            for (Map.Entry<Long, Map<LocalDate, List<Token>>> staffEntry : staffDateTokensMap.entrySet()) {
                Long staffId = staffEntry.getKey();
                Map<LocalDate, List<Token>> dateTokensMap = staffEntry.getValue();

                // Iterate through each date
                for (Map.Entry<LocalDate, List<Token>> dateEntry : dateTokensMap.entrySet()) {
                    LocalDate tokenDate = dateEntry.getKey();
                    List<Token> staffTokens = dateEntry.getValue();

                    // Sort tokens by issued time (FIFO queue)
                    staffTokens.sort(Comparator.comparing(Token::getIssuedTime));

                    // Identify the first ACTIVE token for this (Service ID, Staff ID, Date)
                    Token currentToken = staffTokens.stream()
                            .filter(token -> token.getStatus().equals(TokenStatus.ACTIVE))
                            .findFirst()
                            .orElse(null);

                    // Store current token separately for each (Service ID, Staff ID, Date)
                    String key = serviceId + "_" + staffId + "_" + tokenDate;
                    currentTokenMap.put(key, currentToken); // Can be null if no active token exists

                    // Calculate 'people ahead' for each user's token under this specific (Service ID, Staff ID, Date)
                    int count = 0;
                    for (Token token : staffTokens) {
                        if (token.getStatus().equals(TokenStatus.PENDING)) {
                            peopleAheadMap.put(token.getId(), count);
                            count++; // Increment count only for PENDING tokens
                        }
                    }
                }
            }
        }

        // Collect the current tokens into a list, filtering out null values (if any)
        List<Token> currentTokens = currentTokenMap.values().stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return new TokenResponseDto(userTokens, currentTokens, peopleAheadMap);
    }





    @Override
    public List<Token> tokenHistory(Integer id) {
        return tokenRepository.findByUserId(id);

    }
}
