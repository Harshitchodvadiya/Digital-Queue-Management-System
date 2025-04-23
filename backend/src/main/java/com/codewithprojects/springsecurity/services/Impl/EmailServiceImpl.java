package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendEmail(String to, String subject, String text) {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("archie.koshti@ics-global.in");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            // ✅ Handle error, don't crash SSE
            System.err.println("Email failed: " + e.getMessage());
        }

    }
}
