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

//    @PostMapping("/requestToken")
//    public ResponseEntity<?> requestToken(@RequestBody Token token){
//
//        System.out.println(token);
//        System.out.println(token.getUser().getId());
//
//        User staffServices=  userService.findUserById(Long.valueOf(token.getStaffId().getId()));
//        User user = userService.findUserById(Long.valueOf(token.getUser().getId()));
//        System.out.println(staffServices);
//        System.out.println(user);
//
//        token.setStaffId(staffServices);
//        token.setUser(user);
//        return tokenService.addToken(token);
//    }

    @PostMapping("/requestToken")
    public ResponseEntity<?> requestToken(@RequestBody Token token) {
        if (token == null || token.getUser() == null || token.getStaffId() == null) {
            return ResponseEntity.badRequest().body("Invalid token request: Missing user or staff details");
        }

        Long staffId = Long.valueOf(token.getStaffId().getId());
        Long userId = Long.valueOf(token.getUser().getId());

        if (staffId == null || userId == null) {
            return ResponseEntity.badRequest().body("Invalid request: Staff ID or User ID is null");
        }

        User staffUser = userService.findUserById(staffId);
        User user = userService.findUserById(userId);

        if (staffUser == null || user == null) {
            return ResponseEntity.badRequest().body("Invalid request: User or Staff not found");
        }

        token.setStaffId(staffUser);
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

    @PutMapping("/updateToken/{id}")
    public Token updateToken(@PathVariable Long id, @RequestBody Token token){
        return tokenService.updateToken(id,token);
    }
}
