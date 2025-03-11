package com.codewithprojects.springsecurity;

import com.codewithprojects.springsecurity.entities.Role;
import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class SpringsecurityApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	/**
	 * The main entry point of the Spring Boot application.
	 * @param args command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(SpringsecurityApplication.class, args);
	}

	/**
	 * This method runs after the application starts.
	 * It checks if an admin user exists, and if not, creates a default admin account.
	 * @param args command-line arguments
	 */
	@Override
	public void run(String... args) {
		// Check if an admin user already exists in the database
		User adminAccount = userRepository.findByRole(Role.ADMIN);

		// If no admin user is found, create a new admin account
		if (adminAccount == null) {
			User user = new User();
			user.setEmail("admin@gmail.com");
			user.setFirstname("admin");
			user.setSecondname("admin");
			user.setMobileNumber("1234567890");
			user.setRole(Role.ADMIN);
			user.setPassword(new BCryptPasswordEncoder().encode("admin")); // Encrypt the password

			// Save the admin user to the database
			userRepository.save(user);
		}
	}
}
