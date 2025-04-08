package com.codewithprojects.springsecurity.services;

public interface EmailService {

    void sendEmail(String to, String subject, String text);
}
