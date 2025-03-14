package com.codewithprojects.springsecurity.config;

import com.codewithprojects.springsecurity.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TokenScheduler {

    @Autowired
    private TokenService tokenService;

    /**
     * Scheduled task that updates the waiting times for tokens.
     * This method runs every minute (60000 milliseconds) to keep the queue updated.
     */
    @Scheduled(fixedRate = 60000)
    public void updateWaitingTimes() {
        System.out.println("🟢 Scheduler triggered at: " + LocalDateTime.now());
        tokenService.updateWaitTimes();
    }

}