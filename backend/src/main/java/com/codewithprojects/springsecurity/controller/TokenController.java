package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.TokenStatus;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.StaffService;
import com.codewithprojects.springsecurity.services.TokenService;
import com.codewithprojects.springsecurity.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/token")
public class TokenController {

    private final TokenService tokenService;
    private final StaffService staffService;
    private final UserService userService;
    private final TokenRepository tokenRepository;

    /**
     * Handles a request to generate a new token for a user.
     * Validates the provided token details and assigns the respective staff and user.
     *
     * @param token The token request containing user and staff details.
     * @return A ResponseEntity with the result of the token creation.
     */
    @PostMapping("/requestToken")
    public ResponseEntity<?> requestToken(@RequestBody Token token) {
        if (token == null || token.getUser() == null || token.getStaffId() == null) {
            return ResponseEntity.badRequest().body("Invalid token request: Missing user or staff details");
        }

        Long staffId = Long.valueOf(token.getStaffId().getId());
        Long userId = Long.valueOf(token.getUser().getId());

        if (staffId == null || userId == null) {
            return ResponseEntity.badRequest().body("Invalid request: Staff ID or User ID is null");
        }

        User staffUser = userService.findUserById(staffId);
        User user = userService.findUserById(userId);

        if (staffUser == null || user == null) {
            return ResponseEntity.badRequest().body("Invalid request: User or Staff not found");
        }

        token.setStaffId(staffUser);
        token.setUser(user);

        return tokenService.addToken(token);
    }

    /**
     * Retrieves all requested tokens.
     *
     * @return A list of all requested tokens.
     */
    @GetMapping("/getAllRequestedToken")
    public List<Token> getAllRequestedToken() {
        return tokenService.getAllRequestedToken();
    }

    /**
     * Retrieves all requested tokens for a specific staff member by their ID.
     *
     * @param id The ID of the staff member.
     * @return A list of tokens requested for the specified staff member.
     */
    @GetMapping("/getRequestedTokenByStaffId/{id}")
    public List<Token> getRequestedTokenByStaffId(@PathVariable Integer id) {
        System.out.println("Received Staff ID: " + id);
        return staffService.getRequestedToken(id);
    }

    /**
     * Updates the details of an existing token.
     *
     * @param id    The ID of the token to be updated.
     * @param token The updated token details.
     * @return The updated token object.
     */
    @PutMapping("/updateToken/{id}")
    public Token updateToken(@PathVariable Long id, @RequestBody Token token) {
        return tokenService.updateToken(id, token);
    }

    /**
     * Retrieves a list of all tokens that are still in the waiting queue for today.
     * This excludes completed tokens and sorts them by issued time in ascending order.
     *
     * @return A list of waiting tokens for the current day.
     */
    @GetMapping("/waiting-list")
    public List<Token> getWaitingTokensForToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        return tokenRepository.findAllByIssuedTimeBetweenAndStatusNotOrderByIssuedTimeAsc(
                startOfDay, endOfDay, TokenStatus.COMPLETED
        );
    }
}
