package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.entities.Token;

import java.util.List;

public interface TokenService {

    Token addToken(Token token);
    List<Token> getAllRequestedToken();

}
