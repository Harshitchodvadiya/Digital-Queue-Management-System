package com.codewithprojects.springsecurity;

import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SpringsecurityApplication implements CommandLineRunner {
	@Autowired
	private UserRepository userRepository;

	public static void main (String[] args) {
		SpringApplication.run(SpringsecurityApplication.class, args);
	}

	public void run(String... args){
		User adminAccount = userRepository.findByRole(Role.ADMIN);
		if(null==adminAccount){
			User user = new User();
			user.setEmail("admin@gmail.com");
			user.setFirstname("admin");
			user.setSecondname("admin");
			user.setMobileNumber("1234567890");
			user.setRole(Role.ADMIN);
			user.setPassword(new BCryptPasswordEncoder().encode("admin"));
			userRepository.save(user);
		}
	}
}
