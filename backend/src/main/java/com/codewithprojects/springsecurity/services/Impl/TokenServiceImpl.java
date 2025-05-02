package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.TokenStatus;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.exception.InactiveServiceException;
import com.codewithprojects.springsecurity.exception.InvalidTokenException;
import com.codewithprojects.springsecurity.exception.TimeSlotConflictException;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.EmailService;
import com.codewithprojects.springsecurity.services.NotificationService;
import com.codewithprojects.springsecurity.services.StaffService;
import com.codewithprojects.springsecurity.services.TokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service implementation for handling token-related operations.
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final UserRepository  userRepository;
    private final StaffServicesRepository staffServicesRepository;
    /**
     * Retrieves all tokens requested in the system.
     *
     * @return List of all tokens.
     */
    @Override
    public List<Token> getAllRequestedToken() {
        return tokenRepository.findAll();
    }

    @Transactional
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

    @Override
    @Transactional
    public Token activateNextToken(Long currentTokenId) {
        // Fetch the current token
        Optional<Token> currentTokenOpt = tokenRepository.findById(currentTokenId);
        if (currentTokenOpt.isEmpty()) {
            throw new RuntimeException("Current token not found.");
        }
        Token currentToken = currentTokenOpt.get();

        // Fetch staff service details
        StaffServices staffServices = staffServicesRepository.findById(currentToken.getStaffId().getService().getServiceId()).get();
        log.info(String.valueOf(staffServices.getEstimatedTime()));
//        System.out.println(staffServices.getEstimatedTime());

        // Activate the next token and assign appointed time
        currentToken.setStatus(TokenStatus.ACTIVE);
        currentToken.setAppointedTime(LocalDateTime.now());

        tokenRepository.save(currentToken);

        String subject = "Digital Queue Management System -🎉 It's your turn!";
        String message1 = "Hi " + currentToken.getUser().getFirstname() + ",\n\nYour token #" + currentToken.getId() + " is now active. Please proceed to the counter.\n\n" +

                "Regards,\nDigital Queue Management System";

        //log.info("📧 Sending email to: " + currentToken.getUser().getEmail());

        emailService.sendEmail(currentToken.getUser().getEmail(), subject, message1);

        //  Send Notification to the user-in app
        String message = "It's your turn now for Token #" + currentToken.getId() + "! Please proceed to the counter.";

        notificationService.sendNotification(Long.valueOf(currentToken.getUser().getId()), message);

        return currentToken;
    }

    @Override
    @Transactional
    public Token completeToken(Long tokenId) {
        Optional<Token> tokenOptional = tokenRepository.findById(tokenId);

        if (tokenOptional.isPresent()) {
            Token token = tokenOptional.get();
            token.setStatus(TokenStatus.COMPLETED);
            token.setCompletedTime(LocalDateTime.now());
            tokenRepository.save(token);

            String subject = "Digital Queue Management System - Token completed";
            String message1 = "Hi " + token.getUser().getFirstname() + ",\n\nYour token #" + token.getId() + " is completed.\n\n" +
                    "Regards,\nDigital Queue Management System";
            emailService.sendEmail(token.getUser().getEmail(), subject, message1);

            //  Send Notification to the user-in app
            String message = "Your Token #" + token.getId() + " is completed";
            notificationService.sendNotification(Long.valueOf(token.getUser().getId()), message);

            return token;
        } else {
            throw new RuntimeException("Token not found.");
        }
    }

    @Transactional
    @Override
    public Token skipToken(Long tokenId) {
        Optional<Token> tokenOptional = tokenRepository.findById(tokenId);

        if (tokenOptional.isPresent()) {
            Token token = tokenOptional.get();
            token.setStatus(TokenStatus.SKIPPED);
            // token.setCompletedTime(LocalDateTime.now());
            token.setCompletedTime(null);
            tokenRepository.save(token);

            String subject = "Digital Queue Management System - Token Skipped ";
            String message1 = "Hi " + token.getUser().getFirstname() + ",\n\nYour token #" + token.getId() + " has been skipped.\n\n" +
                    "Please contact support or rejoin the queue.\n\n" +
                    "Regards,\n Digital Queue Management System";

            emailService.sendEmail(token.getUser().getEmail(), subject, message1);

            //  Send Notification to the user-in app
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

        //fetching tokens that were issued today,from the start to the end of the day.
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        // Fetch all tokens of the day to find the last completed one,earliest issued tokens first
        List<Token> pendingTokens = tokenRepository.findAllByIssuedTimeBetweenOrderByIssuedTimeAsc(
                startOfDay, endOfDay
        );

        //current time
        LocalDateTime currentTime = LocalDateTime.now();

        //loops through each token in the pendingTokens list.
        for (int i = 0; i < pendingTokens.size(); i++) {
            Token currentToken = pendingTokens.get(i);

            if(currentToken.getStatus() == TokenStatus.PENDING && currentToken.getIssuedTime().isBefore(LocalDateTime.now())) {
                //update wait time by 5 mins
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

    @Transactional
    @Override
    public Token cancelToken(Long id) {
        Token token = tokenRepository.findById(id).get();

        if(token==null){
            throw new RuntimeException("token is not there");
        }

        if(token.getStatus()==TokenStatus.PENDING){
            token.setStatus(TokenStatus.CANCELLED);
            tokenRepository.save(token);
            return token;
        }
        else {
            throw new RuntimeException("Token is not able to cancel");
        }
    }

    @Transactional
    @Override
    public Token rescheduleToken(Long tokenId, LocalDateTime newIssuedTime) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (token.getStatus().equals(TokenStatus.COMPLETED)) {
            throw new RuntimeException("Token is already completed");
        }

        // Fetch the staff and service details
        int staffId = token.getStaffId().getId();
        User user = userRepository.findById((long) staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        StaffServices service = staffServicesRepository.findById(user.getService().getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Calculate the new token's active duration
        LocalDateTime newEndTime = newIssuedTime.plusMinutes(service.getEstimatedTime());

        // Check if any token exists at the new time or overlaps with the new slot
        boolean isConflict = tokenRepository.existsByIssuedTime(newIssuedTime) ||
                tokenRepository.existsByIssuedTimeBetween(newIssuedTime, newEndTime);

        if (isConflict) {
            throw new RuntimeException("Time slot is already taken or overlaps with an existing token.");
        }

        // Update and save the rescheduled token
        token.setIssuedTime(newIssuedTime);
        token.setStatus(TokenStatus.PENDING);
        return tokenRepository.save(token);
    }

    @Override
    public Map<String, Long> getTokenStats(int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);
        Map<String, Long> stats = new LinkedHashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            stats.put(date.format(formatter), 0L);
        }

        List<Token> tokens = tokenRepository.findAllByIssuedTimeBetween(
                startDate.atStartOfDay(),
                today.atTime(LocalTime.MAX)
        );

        for (Token token : tokens) {
            String dateKey = token.getIssuedTime().toLocalDate().format(formatter);
            stats.computeIfPresent(dateKey, (k, v) -> v + 1);
        }

        return stats;
    }

    /**
     * Adds a new token to the system, ensuring that the selected time slot is available.
     *
     * @param token The token entity containing staff details and issued time.
     * @return ResponseEntity with the saved token if successful, or an error message if the time slot is taken.
     */


//    public ResponseEntity<?> addToken(Token token) {
//        if (token == null || token.getStaffId() == null || token.getStaffId().getId() == null) {
//            return ResponseEntity.badRequest().body("Invalid token or staff ID.");
//        }
//
//        User staff = token.getStaffId();
//        StaffServices service = staff.getService();
//
//        // 🚨 Prevent token creation if service is inactive
//        if (service == null || !service.isActive()) {
//            return ResponseEntity.badRequest().body("Error: Cannot book a token for an inactive service.");
//        }
//
//        // Fetch all active (non-canceled) tokens for the same staff member
//        List<Token> existingTokens = tokenRepository.findAll().stream()
//                .filter(e -> e.getStaffId() != null
//                        && e.getStaffId().getId().equals(staff.getId())
//                        && !TokenStatus.CANCELLED.equals(e.getStatus())) // Ignore canceled tokens
//                .collect(Collectors.toList());
//
//        int estimatedTime = service.getEstimatedTime();
//
//        // Calculate the start and end time for the new token.
//        LocalDateTime newTokenStartTime = token.getIssuedTime();
//        LocalDateTime newTokenEndTime = newTokenStartTime.plusMinutes(estimatedTime);
//
//        // Check if the new token's time slot overlaps with any existing active tokens.
//        boolean isSlotTaken = existingTokens.stream().anyMatch(existingToken -> {
//            LocalDateTime existingStartTime = existingToken.getIssuedTime();
//            LocalDateTime existingEndTime = (existingToken.getCompletedTime() != null)
//                    ? existingToken.getCompletedTime()
//                    : existingStartTime.plusMinutes(existingToken.getStaffId().getService().getEstimatedTime());
//
//            return newTokenStartTime.isBefore(existingEndTime) && newTokenEndTime.isAfter(existingStartTime);
//        });
//
//        if (isSlotTaken) {
//            return ResponseEntity.badRequest().body("Error: The selected time slot is already booked.");
//        }
//
//        // Save the token if no conflicts exist.
//        Token savedToken = tokenRepository.save(token);
//        return ResponseEntity.ok(savedToken);
//    }

    @Transactional
    @Override
    public ResponseEntity<Token> addToken(@RequestBody Token token) {
        if (token == null || token.getStaffId() == null || token.getStaffId().getId() == null) {
            throw new InvalidTokenException("Invalid token or staff ID.");
        }

        User staff = token.getStaffId();
        StaffServices service = staff.getService();

        // Prevent token creation if service is inactive
        if (service == null || !service.isActive()) {
            throw new InactiveServiceException("Cannot book a token for an inactive service.");
        }

        List<Token> existingTokens = tokenRepository.findAll().stream()
                .filter(e -> e.getStaffId() != null
                        && e.getStaffId().getId().equals(staff.getId())
                        && !TokenStatus.CANCELLED.equals(e.getStatus()))
                .collect(Collectors.toList());

        int estimatedTime = service.getEstimatedTime();
        LocalDateTime newStart = token.getIssuedTime();
        LocalDateTime newEnd = newStart.plusMinutes(estimatedTime);

        boolean isSlotTaken = existingTokens.stream().anyMatch(existing -> {
            LocalDateTime existingStart = existing.getIssuedTime();
            LocalDateTime existingEnd = existing.getCompletedTime() != null
                    ? existing.getCompletedTime()
                    : existingStart.plusMinutes(existing.getStaffId().getService().getEstimatedTime());

            return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
        });

        if (isSlotTaken) {
            throw new TimeSlotConflictException("The selected time slot is already booked.");
        }

        Token saved = tokenRepository.save(token);
        return ResponseEntity.ok(saved);
    }


}


