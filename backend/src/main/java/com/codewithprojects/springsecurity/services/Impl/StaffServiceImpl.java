package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffServicesRepository staffServicesRepository;
    private final UserRepository userRepository;

//    @Override
//    public StaffServices addStaffService(StaffServices staffService, Long userId) {

    @Override
    public StaffServices addStaffService(StaffServices staffService) {
       return staffServicesRepository.save(staffService);
    }

    ////        User user = userRepository.findById(userId)
////                .orElseThrow(() -> new RuntimeException("User not found"));
////
////        staffService.setUser(user); // Assign the user to the service
////        return staffServicesRepository.save(staffService);
//    }

    @Override
    public List<StaffServices> getAllService() {
        return staffServicesRepository.findAll();
    }
}
