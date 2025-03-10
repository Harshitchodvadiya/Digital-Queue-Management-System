package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.entities.StaffServices;
import com.codewithprojects.springsecurity.entities.Token;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.StaffServicesRepository;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.StaffService;
import com.codewithprojects.springsecurity.services.TokenService;
import com.codewithprojects.springsecurity.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/token")
public class TokenController {

    private final TokenService tokenService;
    private final StaffService staffService;
    private final UserService userService;

    @PostMapping("/requestToken")
    public ResponseEntity<?> requestToken(@RequestBody Token token){

        System.out.println(token);
        System.out.println(token.getUser().getId());

        User staffServices=  userService.findUserById(Long.valueOf(token.getStaffId().getId()));
        User user = userService.findUserById(Long.valueOf(token.getUser().getId()));
        System.out.println(staffServices);
        System.out.println(user);

        token.setStaffId(staffServices);
        token.setUser(user);
        return tokenService.addToken(token);
    }

    @GetMapping("/getAllRequestedToken")
    public List<Token> getAllRequestedToken(){
        return tokenService.getAllRequestedToken();
    }


    @GetMapping("/getRequestedTokenByStaffId/{id}")
    public List<Token> getRequestedTokenByStaffId(@PathVariable Integer id){
        System.out.println("Received Staff ID: " + id);
//        System.out.println(id);
        return staffService.getRequestedToken(id);
    }
}
