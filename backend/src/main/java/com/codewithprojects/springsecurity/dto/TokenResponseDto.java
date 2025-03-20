package com.codewithprojects.springsecurity.dto;

import com.codewithprojects.springsecurity.entities.Token;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponseDto {
    private List<Token> userTokens;   // All user tokens
    private List<Token> activeTokens; // Active tokens
}
