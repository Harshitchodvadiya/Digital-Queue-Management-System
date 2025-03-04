package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.entities.StaffServices;

import java.util.List;

public interface StaffService {
    StaffServices addStaffService(StaffServices staffService);

    List<StaffServices> getAllService();
}