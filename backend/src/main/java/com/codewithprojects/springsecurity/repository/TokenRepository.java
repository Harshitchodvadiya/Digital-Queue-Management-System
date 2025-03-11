package com.codewithprojects.springsecurity.repository;

import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for managing Token entities.
 * Extends JpaRepository to provide CRUD operations.
 */
@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    /**
     * Retrieves all tokens issued today that are not completed, ordered by issued time.
     *
     * @param startOfDay The start time of the day (00:00).
     * @param endOfDay   The end time of the day (23:59).
     * @param status     The status to exclude (e.g., COMPLETED).
     * @return List of tokens issued today that are not in the given status, sorted by issued time.
     */
    List<Token> findAllByIssuedTimeBetweenAndStatusNotOrderByIssuedTimeAsc(
            LocalDateTime startOfDay, LocalDateTime endOfDay, TokenStatus status
    );

    List<Token> findByStaffId_IdAndStatusOrderByAppointedTimeAsc(Long aLong, TokenStatus tokenStatus);

//    List<Token> findByStaffIdAndStatusOrderByAppointedTimeAsc(Long staffId, TokenStatus status);

}
