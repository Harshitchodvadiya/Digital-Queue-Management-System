package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.controller.NotificationController;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.TokenStatus;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.services.NotificationService;
import com.codewithprojects.springsecurity.services.StaffService;
import com.codewithprojects.springsecurity.services.TokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
    private final NotificationService notificationService;



    private  final StaffServicesRepository staffServicesRepository;
    /**
     * Retrieves all tokens requested in the system.
     *
     * @return List of all tokens.
     */
    @Override
    public List<Token> getAllRequestedToken() {
        return tokenRepository.findAll();
    }

    @Override
    public Token updateToken(Long id, Token token) {
        Optional<Token> existingToken = tokenRepository.findById(id);

        if (existingToken.isPresent()) {
            Token updatedToken = existingToken.get();
            LocalDateTime previousAppointedTime = updatedToken.getAppointedTime();
            int estimatedDuration = updatedToken.getStaffId().getService().getEstimatedTime();

            updatedToken.setStatus(token.getStatus());
            updatedToken.setAppointedTime(token.getAppointedTime());

            if (token.getStatus() == TokenStatus.COMPLETED || token.getStatus() == TokenStatus.SKIPPED) {
                updatedToken.setCompletedTime(LocalDateTime.now());
            }

            tokenRepository.save(updatedToken);

            // Activate the next token if applicable
            if ((token.getStatus() == TokenStatus.COMPLETED || token.getStatus() == TokenStatus.SKIPPED) &&
                    updatedToken.getCompletedTime().toLocalDate().isEqual(LocalDate.now())) {

                List<Token> nextTokens = tokenRepository.findByStaffId_IdAndStatusOrderByAppointedTimeAsc(
                        Long.valueOf(updatedToken.getStaffId().getId()), TokenStatus.PENDING
                );

                if (!nextTokens.isEmpty()) {
                    Token nextToken = nextTokens.get(0);
                    LocalDateTime newAppointedTime = updatedToken.getCompletedTime().plusMinutes(1);
                    nextToken.setAppointedTime(newAppointedTime);
                    nextToken.setStatus(TokenStatus.ACTIVE);
                    tokenRepository.save(nextToken);
                }
            }

            return updatedToken;
        } else {
            throw new RuntimeException("Token not found with ID: " + id);
        }
    }

    public Token activateNextToken(Long currentTokenId) {
        // Fetch the current token
        Optional<Token> currentTokenOpt = tokenRepository.findById(currentTokenId);
        if (currentTokenOpt.isEmpty()) {
            throw new RuntimeException("Current token not found.");
        }
        Token currentToken = currentTokenOpt.get();

        // Fetch staff service details
        StaffServices staffServices = staffServicesRepository.findById(currentToken.getStaffId().getService().getServiceId()).get();
        System.out.println(staffServices.getEstimatedTime());

        // Activate the next token and assign appointed time
        currentToken.setStatus(TokenStatus.ACTIVE);
        currentToken.setAppointedTime(LocalDateTime.now());

        tokenRepository.save(currentToken);

        // 🔔 Send Notification to the user
        String message = "It's your turn now for Token #" + currentToken.getId() + "! Please proceed to the counter.";
        notificationService.sendNotification(Long.valueOf(currentToken.getUser().getId()), message);

        return currentToken;
    }


    public Token completeToken(Long tokenId) {
        Optional<Token> tokenOptional = tokenRepository.findById(tokenId);

        if (tokenOptional.isPresent()) {
            Token token = tokenOptional.get();
            token.setStatus(TokenStatus.COMPLETED);
            token.setCompletedTime(LocalDateTime.now());
            tokenRepository.save(token);
            return token;
        } else {
            throw new RuntimeException("Token not found.");
        }
    }

    @Override
    public Token skipToken(Long tokenId) {
        Optional<Token> tokenOptional = tokenRepository.findById(tokenId);

        if (tokenOptional.isPresent()) {
            Token token = tokenOptional.get();
            token.setStatus(TokenStatus.SKIPPED);
            token.setCompletedTime(LocalDateTime.now());
            tokenRepository.save(token);

            // 🔔 Send Notification to the user
            String message = "❌ Your Token #" + token.getId() + " was skipped by staff.";
            notificationService.sendNotification(Long.valueOf(token.getUser().getId()), message);

            // Find the next pending token and mark it as next
            List<Token> nextTokens = tokenRepository.findByStaffId_IdAndStatusOrderByAppointedTimeAsc(
                    Long.valueOf(token.getStaffId().getId()), TokenStatus.PENDING);

            return token;
        } else {
            throw new RuntimeException("Token not found.");
        }
    }


    @Override
    @Transactional
    public void updateWaitTimes() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);


        // Fetch all tokens of the day to find the last completed one
        List<Token> pendingTokens = tokenRepository.findAllByIssuedTimeBetweenOrderByIssuedTimeAsc(
                startOfDay, endOfDay
        );


        LocalDateTime currentTime = LocalDateTime.now();


        for (int i = 0; i < pendingTokens.size(); i++) {
            Token currentToken = pendingTokens.get(i);

            if(currentToken.getStatus() == TokenStatus.PENDING && currentToken.getIssuedTime().isBefore(LocalDateTime.now())) {

                currentToken.setAdditionalWaitTime(currentToken.getAdditionalWaitTime() + 5);
                tokenRepository.save(currentToken);
            }
//        }

        // If there is a previous pending token, check if it's completed
//        if (i > 0) {
//            Token previousToken = pendingTokens.get(i - 1);
//            if (previousToken.getStatus() == TokenStatus.COMPLETED) {
//                currentToken.setAdditionalWaitTime(currentToken.getAdditionalWaitTime() + 5);
//                tokenRepository.save(currentToken);
//            }
//        }

        // If the current token has an appointed time and is still running, increase wait time
//        if (currentToken.getAppointedTime() != null) {
//            LocalDateTime expectedEndTime = currentToken.getAppointedTime()
//                    .plusMinutes(currentToken.getAdditionalWaitTime());
//
//            if (currentTime.isBefore(expectedEndTime)) {
//                currentToken.setAdditionalWaitTime(currentToken.getAdditionalWaitTime() + 5);
//                tokenRepository.save(currentToken);
//            }
//        }
    }
}

    @Override
    public Token currentTokenNumber() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);


        // Fetch all tokens of the day to find the last completed one
        List<Token> pendingTokens = tokenRepository.findAllByIssuedTimeBetweenOrderByIssuedTimeAsc(
                startOfDay, endOfDay
        );

        LocalDateTime currentTime = LocalDateTime.now();


        for (int i = 0; i < pendingTokens.size(); i++) {
            Token currentToken = pendingTokens.get(i);

            if (currentToken.getStatus() == TokenStatus.ACTIVE) {
                return currentToken;
            }
        }
        return null;
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
