package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.dto.TokenResponseDto;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.TokenStatus;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.services.StaffService;
import com.codewithprojects.springsecurity.services.TokenService;
import com.codewithprojects.springsecurity.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;


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

    @GetMapping("/getRequestedTokenByUserId/{id}")
    public TokenResponseDto getRequestedTokenByUserId(@PathVariable Integer id) {
        System.out.println("Received User ID: " + id);
        return userService.getRequestedToken(id);
    }

    // only today's data
    @GetMapping("/getTodayTokensByStaffId/{id}")
    public List<Token> getTodayTokensByStaffId(@PathVariable Long id) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        return tokenRepository.findAllByStaffIdIdAndIssuedTimeBetweenOrderByIssuedTimeAsc(
                id, startOfDay, endOfDay
        );
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

    @PutMapping("/nextToken/{tokenId}")
    public ResponseEntity<?> activateNextToken(@PathVariable Long tokenId) {
        Token nextToken = tokenService.activateNextToken(tokenId);
        return ResponseEntity.ok(nextToken);
    }

    @PutMapping("/completeToken/{tokenId}")
    public ResponseEntity<?> completeToken(@PathVariable Long tokenId) {
        return ResponseEntity.ok(tokenService.completeToken(tokenId));
    }

    @PutMapping("/skipToken/{tokenId}")
    public ResponseEntity<?> skipToken(@PathVariable Long tokenId) {
        return ResponseEntity.ok(tokenService.skipToken(tokenId));
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

    @GetMapping("/currentToken")
    public Token currentToken(){
        return tokenService.currentTokenNumber();
    }


    @GetMapping("/tokenHistory/{id}")
    public List<Token> tokenHistory(@PathVariable Integer id) {
        System.out.println("Received User ID: " + id);
        return userService.tokenHistory(id);
    }

    @PutMapping("/cancelToken/{id}")
    public Token cancelToken(@PathVariable Long id){
        return tokenService.cancelToken(id);
    }

    @PutMapping("/rescheduleToken/{id}")
    public ResponseEntity<?> rescheduleToken(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        try {
            String newIssuedTime = requestBody.get("newIssuedTime");
            if (newIssuedTime == null) {
                return ResponseEntity.badRequest().body("Missing newIssuedTime in request body");
            }
            // Convert ISO 8601 to LocalDateTime
            Instant instant = Instant.parse(newIssuedTime);
            LocalDateTime newTime = instant.atZone(ZoneId.systemDefault()).toLocalDateTime();

            Token updateToken = tokenService.rescheduleToken(id, newTime);
            return ResponseEntity.ok(updateToken);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rescheduling token: " + e.getMessage());
        }
    }

    @GetMapping("/token-stats")
    public ResponseEntity<List<Map<String, Object>>> getTokenStats(@RequestParam(defaultValue = "7") int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        List<Token> tokens = tokenRepository.findAllByIssuedTimeBetween(
                startDate.atStartOfDay(), today.plusDays(1).atStartOfDay()
        );

        Map<LocalDate, Map<String, Long>> statsMap = new TreeMap<>();

        for (Token token : tokens) {
            if (token.getIssuedTime() == null || token.getStatus() == null) continue;

            LocalDate date = token.getIssuedTime().toLocalDate();
            String status = token.getStatus().name(); // ENUM → String like "COMPLETED"

            statsMap.putIfAbsent(date, new HashMap<>());
            Map<String, Long> dayStats = statsMap.get(date);
            dayStats.put(status, dayStats.getOrDefault(status, 0L) + 1);
        }

        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Map.Entry<LocalDate, Map<String, Long>> entry : statsMap.entrySet()) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", entry.getKey().toString());
            dayData.put("completed", entry.getValue().getOrDefault("COMPLETED", 0L));
            dayData.put("skipped", entry.getValue().getOrDefault("SKIPPED", 0L));
            dayData.put("cancelled", entry.getValue().getOrDefault("CANCELLED", 0L));
            responseList.add(dayData);
        }

        return ResponseEntity.ok(responseList);
    }

}
