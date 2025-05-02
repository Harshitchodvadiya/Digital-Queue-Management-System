package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.JWTService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

/**
 * Implementation of JWTService.
 * Handles JWT token generation, validation, and extraction of claims.
 */
@Slf4j
@Service
public class JWTServiceImpl implements JWTService {

    @Value("${jwt.secret:}") // Load secret key from properties, fallback to empty if not set
    private String secretKey;

    @Autowired
    private UserRepository userRepository;

    private Key signingKey;

    /**
     * Constructor initializes the signing key.
     * If no secret key is provided, a new secure key is generated.
     */
    public JWTServiceImpl() {
        if (secretKey == null || secretKey.isEmpty()) {
            secretKey = generateSecureKey();
        }
        signingKey = getSigningKey();
    }

    /**
     * Generates a secure Base64-encoded key for JWT signing.
     *
     * @return Base64 encoded secret key string.
     */
    private String generateSecureKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            keyGenerator.init(256);
            SecretKey key = keyGenerator.generateKey();
            return Base64.getEncoder().encodeToString(key.getEncoded());
        } catch (Exception e) {
            throw new RuntimeException("Error generating JWT secret key", e);
        }
    }

    /**
     * Decodes the stored secret key and returns a valid signing key.
     *
     * @return Decoded signing key.
     */
    private Key getSigningKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid secret key format. Ensure it's Base64 encoded.", e);
        }
    }

    /**
     * Generates a JWT token for a given user.
     *
     * @param userDetails The user details from Spring Security.
     * @return The generated JWT token.
     */
    public String generateToken(UserDetails userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());

        log.info(String.valueOf(user));

        // Default to "USER" role if no roles are assigned
        String role = userDetails.getAuthorities().isEmpty() ? "USER" :
                userDetails.getAuthorities().iterator().next().getAuthority();

        return Jwts.builder()
                .setSubject(userDetails.getUsername() + "/" + user.get().getId() + ":" + role) // Format: username/userId:role
                // eg: archie@gmail.com/7:USER
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Token valid for 24 hours
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Generates a refresh token for a given user.
     * Includes extra claims such as role information.
     *
     * @param extraClaims Additional claims to be added to the token.
     * @param userDetails The user details from Spring Security.
     * @return The generated refresh token.
     */
    public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        String role = userDetails.getAuthorities().isEmpty() ? "USER" :
                userDetails.getAuthorities().iterator().next().getAuthority();

        extraClaims.put("role", role); // Add role as a separate claim

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // Keep subject clean
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // Refresh token valid for 7 days
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }
    /**
     * Extracts the username from a JWT token.
     * @param token The JWT token.
     * @return The extracted username.
     */
    public String extractUserName(String token) {
        String subject = extractClaim(token, Claims::getSubject);
        return subject.split(":")[0]; // Extract username only
    }

    /**
     * Extracts the role of the user from a JWT token.
     *
     * @param token The JWT token.
     * @return The extracted role.
     */
    public String extractUserRole(String token) {
        String subject = extractClaim(token, Claims::getSubject);
        return subject.contains(":") ? subject.split(":")[1] : "USER"; // Extract role
    }

    /**
     * Extracts a specific claim from a JWT token.
     *
     * @param token          The JWT token.
     * @param claimsResolver The function to extract the desired claim.
     * @param <T>            The type of the claim.
     * @return The extracted claim.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from a JWT token.
     *
     * @param token The JWT token.
     * @return The claims contained in the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Validates a JWT token against a user's details.
     *
     * @param token       The JWT token.
     * @param userDetails The user details from Spring Security.
     * @return True if the token is valid, false otherwise.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token).split("/")[0]; // Extract only the email
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Checks if a JWT token is expired.
     *
     * @param token The JWT token.
     * @return True if the token has expired, false otherwise.
     */
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
