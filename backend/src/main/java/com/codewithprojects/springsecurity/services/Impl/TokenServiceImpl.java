package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.TokenStatus;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.services.TokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for handling token-related operations.
 */
@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;

    /**
     * Retrieves all tokens requested in the system.
     *
     * @return List of all tokens.
     */
    @Override
    public List<Token> getAllRequestedToken() {
        return tokenRepository.findAll();
    }

    /**
     * Updates a token's status and timestamps.
     *
     * @param id    The ID of the token to update.
     * @param token The updated token details.
     * @return The updated token entity.
     * @throws RuntimeException if the token is not found.
     */
//    @Override
//    public Token updateToken(Long id, Token token) {
//        Optional<Token> existingToken = tokenRepository.findById(id);
//        if (existingToken.isPresent()) {
//            Token updatedToken = existingToken.get();
//            updatedToken.setStatus(token.getStatus());
//            updatedToken.setAppointedTime(token.getAppointedTime());
//            updatedToken.setCompletedTime(token.getCompletedTime());
//            return tokenRepository.save(updatedToken);
//        } else {
//            throw new RuntimeException("Token not found with ID: " + token.getId());
//        }
//    }


    @Override
    public Token updateToken(Long id, Token token) {
        Optional<Token> existingToken = tokenRepository.findById(id);

        if (existingToken.isPresent()) {
            Token updatedToken = existingToken.get();

            // Track previous appointed time and estimated completion time
            LocalDateTime previousAppointedTime = updatedToken.getAppointedTime();
            int estimatedDuration = updatedToken.getStaffId().getService().getEstimatedTime(); // Estimated service time

            updatedToken.setStatus(token.getStatus());
            updatedToken.setAppointedTime(token.getAppointedTime());
            updatedToken.setCompletedTime(token.getCompletedTime());
            tokenRepository.save(updatedToken);

            // Check if completed early and ensure both tokens are for the same day
            if (token.getCompletedTime().toLocalDate().isEqual(LocalDate.now()) &&
                    token.getCompletedTime().isBefore(previousAppointedTime.plusMinutes(estimatedDuration))) {

                List<Token> nextTokens = tokenRepository.findByStaffId_IdAndStatusOrderByAppointedTimeAsc(
                        Long.valueOf(updatedToken.getStaffId().getId()), TokenStatus.PENDING
                );

                if (!nextTokens.isEmpty()) {
                    Token nextToken = nextTokens.get(0);

                    // Ensure the next token's appointed time is set for today
                    LocalDateTime newAppointedTime = token.getCompletedTime().plusMinutes(1);
                    if (newAppointedTime.toLocalDate().isEqual(LocalDate.now())) {
                        nextToken.setAppointedTime(newAppointedTime);
                        tokenRepository.save(nextToken);
                    } else {
                        System.out.println("Skipping token adjustment as it's for another day.");
                    }
                }
            }

            return updatedToken;
        } else {
            throw new RuntimeException("Token not found with ID: " + token.getId());
        }
    }



    /**
     * Updates the estimated wait times for pending tokens based on the current time.
     * If the appointed time of a token has passed, it increases the wait time for the subsequent tokens.
     */

    @Override
    @Transactional
    public void updateWaitTimes() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay(); // 00:00
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX); // 23:59:59

        // Fetch pending tokens for today, sorted by issued time.
        List<Token> pendingTokens = tokenRepository.findAllByIssuedTimeBetweenAndStatusNotOrderByIssuedTimeAsc(
                startOfDay, endOfDay, TokenStatus.COMPLETED
        );

        for (int i = 0; i < pendingTokens.size(); i++) {
            Token currentToken = pendingTokens.get(i);

            // Null check for appointed time
            if (currentToken.getAppointedTime() == null) {
                System.out.println("⚠️ Warning: Token ID " + currentToken.getId() + " has null appointed time. Skipping...");
                continue; // Skip this token to prevent NullPointerException
            }

            // Calculate the expected end time (appointed time + additional wait time).
            LocalDateTime expectedEndTime = currentToken.getAppointedTime()
                    .plusMinutes(currentToken.getAdditionalWaitTime());

            // If the expected end time has passed, increase the wait time for subsequent tokens.
            if (LocalDateTime.now().isAfter(expectedEndTime)) {
                for (int j = i + 1; j < pendingTokens.size(); j++) {
                    Token nextToken = pendingTokens.get(j);
                    nextToken.setAdditionalWaitTime(nextToken.getAdditionalWaitTime() + 5);
                    tokenRepository.save(nextToken);
                }
            }
        }
    }


    /**
     * Adds a new token to the system, ensuring that the selected time slot is available.
     *
     * @param token The token entity containing staff details and issued time.
     * @return ResponseEntity with the saved token if successful, or an error message if the time slot is taken.
     */
    public ResponseEntity<?> addToken(Token token) {
        if (token == null || token.getStaffId() == null || token.getStaffId().getId() == null) {
            return ResponseEntity.badRequest().body("Invalid token or staff ID.");
        }

        // Fetch all tokens and filter by staff ID to check for overlapping time slots.
        List<Token> existingTokens = tokenRepository.findAll().stream()
                .filter(e -> e.getStaffId() != null && e.getStaffId().getId().equals(token.getStaffId().getId()))
                .collect(Collectors.toList());

        // Get estimated service time in minutes for the staff member.
        int estimatedTime = token.getStaffId().getService().getEstimatedTime();

        // Calculate the start and end time for the new token.
        LocalDateTime newTokenStartTime = token.getIssuedTime();
        LocalDateTime newTokenEndTime = newTokenStartTime.plusMinutes(estimatedTime);

        // Check if the new token's time slot overlaps with any existing tokens.
        boolean isSlotTaken = existingTokens.stream().anyMatch(existingToken -> {
            LocalDateTime existingStartTime = existingToken.getIssuedTime();
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(existingToken.getStaffId().getService().getEstimatedTime());

            // Condition for overlapping time slots.
            return newTokenStartTime.isBefore(existingEndTime) && newTokenEndTime.isAfter(existingStartTime);
        });

        if (isSlotTaken) {
            return ResponseEntity.badRequest().body("Error: The selected time slot is already booked.");
        }

        // Save the token if no conflicts exist.
        Token savedToken = tokenRepository.save(token);
        return ResponseEntity.ok(savedToken);
    }
}
