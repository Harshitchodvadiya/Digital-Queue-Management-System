package com.codewithprojects.springsecurity.repository;

import com.codewithprojects.springsecurity.entities.StaffServices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffServicesRepository extends JpaRepository<StaffServices, Long> {
    List<StaffServices> findAll();


}