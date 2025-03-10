package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.dto.SignUpRequest;
import com.codewithprojects.springsecurity.dto.UpdateServiceRequest;
import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.TokenRepository;
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
    private final TokenServiceImpl tokenServiceImpl;



    @Override
    public StaffServices addStaffService(StaffServices staffService) {
       return staffServicesRepository.save(staffService);
    }

    @Override
    public List<StaffServices> getAllService() {

        return staffServicesRepository.findAll();
    }

    @Override
    public StaffServices getStaffServiceById(Long id) {

        return staffServicesRepository.findById(id).get();
    }


    public StaffServices updateServiceById(Long id, UpdateServiceRequest updateServiceRequest) {
        StaffServices services = staffServicesRepository.findById(id).orElseThrow(() -> new RuntimeException("Service not found"));
        services.setServiceName(updateServiceRequest.getServiceName());
        services.setServiceDescription(updateServiceRequest.getServiceDescription());
        services.setEstimatedTime(updateServiceRequest.getEstimatedTime());
        services.setActive(updateServiceRequest.isActive());


        return staffServicesRepository.save(services);
    }

    @Override
    public List<Token> getRequestedToken(Integer user_id) {
        List<Token> tokens = tokenServiceImpl.getAllRequestedToken();
        System.out.println(tokens);
        // Filter tokens based on the provided user_id
        return tokens.stream()
//                .filter(token -> token.getStaffId().getId() == user_id)

                .filter(token -> token.getStaffId().getId().equals( user_id))
                .toList(); // Converts the stream back to a list
    }



}
