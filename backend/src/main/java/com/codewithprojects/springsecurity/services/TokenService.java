package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.entities.Token;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TokenService {

    ResponseEntity<?> addToken(Token token);
    List<Token> getAllRequestedToken();

}
