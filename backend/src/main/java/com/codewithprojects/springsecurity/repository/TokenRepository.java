package com.codewithprojects.springsecurity.repository;

import com.codewithprojects.springsecurity.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TokenRepository extends JpaRepository<Token,Long> {
}
