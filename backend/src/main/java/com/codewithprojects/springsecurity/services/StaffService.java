package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.dto.UpdateServiceRequest;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;

import java.util.List;


public interface StaffService {
    StaffServices addStaffService(StaffServices staffService);

    List<StaffServices> getAllService();

    StaffServices getStaffServiceById(Long id);

    StaffServices updateServiceById(Long id, UpdateServiceRequest updateServiceRequest);

    List<Token> getRequestedToken(Integer id);
}