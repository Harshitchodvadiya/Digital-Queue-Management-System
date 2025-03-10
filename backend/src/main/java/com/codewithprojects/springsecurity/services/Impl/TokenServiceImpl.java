package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.services.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;

    @Override
    public List<Token> getAllRequestedToken() {
        return tokenRepository.findAll();
    }

    @Override
    public Token updateToken(Long id,Token token) {
        // Check if the token exists in the database
        Optional<Token> existingToken = tokenRepository.findById(id);
        System.out.println(existingToken);
        if (existingToken.isPresent()) {
            Token updatedToken = existingToken.get(); // Retrieve existing token
            updatedToken.setStatus(token.getStatus());
            updatedToken.setAppointedTime(token.getAppointedTime());
            updatedToken.setCompletedTime(token.getCompletedTime());
            return tokenRepository.save(updatedToken); // Save changes
        } else {
            throw new RuntimeException("Token not found with ID: " + token.getId());
        }
    }


    public ResponseEntity<?> addToken(Token token) {
        if (token == null || token.getStaffId() == null || token.getStaffId().getId() == null) {
            return ResponseEntity.badRequest().body("Invalid token or staff ID.");
        }

        // Fetch all tokens and filter by the given staff ID using streams
        List<Token> existingTokens = tokenRepository.findAll().stream()
                .filter(e -> e.getStaffId() != null && e.getStaffId().getId().equals(token.getStaffId().getId()))
                .collect(Collectors.toList());

        // Get estimated service time in minutes
        int estimatedTime = token.getStaffId().getService().getEstimatedTime();

        // Calculate the start and end time for the new token
        LocalDateTime newTokenStartTime = token.getIssuedTime();
        LocalDateTime newTokenEndTime = newTokenStartTime.plusMinutes(estimatedTime);

        // Check for overlapping time slots
        boolean isSlotTaken = existingTokens.stream().anyMatch(existingToken -> {
            LocalDateTime existingStartTime = existingToken.getIssuedTime();
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(existingToken.getStaffId().getService().getEstimatedTime());

            // Overlapping condition
            return newTokenStartTime.isBefore(existingEndTime) && newTokenEndTime.isAfter(existingStartTime);
        });

        if (isSlotTaken) {
            return ResponseEntity.badRequest().body("Error: The selected time slot is already booked.");
        }

        // Save and return the token if the slot is available
        Token savedToken = tokenRepository.save(token);
        return ResponseEntity.ok(savedToken);
    }


}
