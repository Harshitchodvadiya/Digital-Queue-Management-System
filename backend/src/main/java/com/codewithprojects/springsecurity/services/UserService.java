package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.entities.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface UserService {
    UserDetailsService userDetailsService();
    User findUserById(Long id);
}