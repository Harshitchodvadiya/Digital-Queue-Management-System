package com.codewithprojects.springsecurity.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")

    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "staff_id")
    private User staffId;

    @Enumerated(EnumType.STRING)
    private TokenStatus status = TokenStatus.PENDING;

    private LocalDateTime issuedTime;
    private LocalDateTime appointedTime;
    private LocalDateTime completedTime;
}

