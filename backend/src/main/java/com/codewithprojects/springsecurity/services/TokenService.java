package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.entities.Token;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * Service interface for managing token-related operations.
 */
public interface TokenService {

    /**
     * Adds a new token request to the system.
     *
     * @param token The token entity containing request details.
     * @return A ResponseEntity containing the response status and message.
     */
    ResponseEntity<?> addToken(Token token);

    /**
     * Retrieves all token requests that have been made.
     *
     * @return A list of all requested tokens.
     */
    List<Token> getAllRequestedToken();

    /**
     * Updates the details of an existing token.
     *
     * @param id The ID of the token to be updated.
     * @param token The updated token details.
     * @return The updated Token entity.
     */
    Token updateToken(Long id, Token token);

    Token skipToken(Long tokenId);

    Token completeToken(Long tokenId);

    Token activateNextToken(Long staffId);
    /**
     * Updates the estimated wait times for all active tokens dynamically.
     */
    void updateWaitTimes();

    Token currentTokenNumber();

    Token cancelToken(Long id);
}
