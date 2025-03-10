package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.services.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;

    @Override
    public List<Token> getAllRequestedToken() {
        return tokenRepository.findAll();
    }

    public ResponseEntity<?> addToken(Token token) {
        // Fetch all tokens for the given service
        List<Token> existingTokens = tokenRepository.findAll();

        // Check if any existing token has the same service and estimated time
        boolean isSlotTaken = existingTokens.stream()
                .anyMatch(existingToken -> existingToken.getStaffId().getId().equals(token.getStaffId().getId())
                        && existingToken.getEstimatedTime().equals(token.getEstimatedTime()));

        if (isSlotTaken) {
            return ResponseEntity.badRequest().body("Error: The selected time slot is already booked.");
//            throw new RuntimeException();
        }

        // Save the token if the slot is available
        return  ResponseEntity.ok(tokenRepository.save(token)) ;
    }
}
