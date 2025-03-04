package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.repository.TokenRepository;
import com.codewithprojects.springsecurity.services.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;
    @Override
    public Token addToken(Token token) {
        return tokenRepository.save(token);
    }

    @Override
    public List<Token> getAllRequestedToken() {
        return tokenRepository.findAll();
    }
}
