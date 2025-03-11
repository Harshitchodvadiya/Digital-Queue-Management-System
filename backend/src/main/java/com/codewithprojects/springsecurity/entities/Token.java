package com.codewithprojects.springsecurity.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing a token in the queue management system.
 * Each token is associated with a user and staff member, and it tracks
 * various timestamps related to its processing.
 */
@Entity
@Table(name = "tokens")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the token

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user; // The user (customer) who owns the token

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "staff_id")
    private User staffId; // The staff member assigned to handle this token

    @Enumerated(EnumType.STRING)
    private TokenStatus status = TokenStatus.PENDING; // Current status of the token

    private LocalDateTime issuedTime; // Time when the token was issued
    private LocalDateTime appointedTime; // Scheduled time for the token
    private LocalDateTime completedTime; // Time when the token was marked as completed

    private int additionalWaitTime = 0; // Extra wait time dynamically added if required
}
