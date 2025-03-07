//package com.codewithprojects.springsecurity.services.Impl;
//
//import com.codewithprojects.springsecurity.services.JWTService;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//import java.security.Key;
//import java.util.Base64;
//import java.util.Date;
//import java.util.Map;
//import java.util.Objects;
//import java.util.function.Function;
//
//@Service
//public class JWTServiceImpl implements JWTService {
//
//
//    public  String generateToken(UserDetails userDetails){
//        return Jwts.builder().setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis()+1000*60*24))
//                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
//                .compact();
//
//    }
//
//    public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails){
//        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis()+604800000))
//                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
//                .compact();
//
//    }
//
//    public String extractUserName(String token){
//        return extractClaim(token,Claims::getSubject);
//    }
//
//    private <T> T extractClaim(String token, Function<Claims,T> claimsResolvers){
//        final Claims claims = extractAllClaim(token);
//        return claimsResolvers.apply(claims);
//    }
//
//
//    private Key getSiginKey(){
//        byte[] key= Decoders.BASE64.decode("");
//        return Keys.hmacShaKeyFor(key);
//    }
//
//    private Claims extractAllClaim(String token){
//        return Jwts.parserBuilder().setSigningKey(getSiginKey()).build().parseClaimsJws(token).getBody();
//    }
//
//    public boolean isTokenValid(String token,UserDetails userDetails){
//        final String username=  extractUserName(token);
//        return (username.equals(userDetails.getUsername())&&!isTokenExpired(token));
//    }
//
//    private boolean isTokenExpired(String token){
//        return extractClaim(token,Claims::getExpiration).before(new Date());
//    }
//}

package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.User;
import com.codewithprojects.springsecurity.repository.UserRepository;
import com.codewithprojects.springsecurity.services.JWTService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
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

@Service
public class JWTServiceImpl implements JWTService {

    @Value("${jwt.secret:}") // Load secret key from properties, fallback to empty if not set
    private String secretKey;
    @Autowired
    private  UserRepository userRepository;
    private Key signingKey;

    public JWTServiceImpl() {
        if (secretKey == null || secretKey.isEmpty()) {
            secretKey = generateSecureKey();
        }
        signingKey = getSigningKey();
    }

    // Generate a secure key if none is provided
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

    private Key getSigningKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid secret key format. Ensure it's Base64 encoded.", e);
        }
    }

    public String generateToken(UserDetails userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        System.out.println(user);
        //no assigned roles, it defaults to "USER"
        String role = userDetails.getAuthorities().isEmpty() ? "USER" :
                userDetails.getAuthorities().iterator().next().getAuthority(); // Get the first role
        return Jwts.builder()
                .setSubject(userDetails.getUsername() +"/" + user.get().getId() + ":" + role) // Username:Role
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours expiry
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        String role = userDetails.getAuthorities().isEmpty() ? "USER" :
                userDetails.getAuthorities().iterator().next().getAuthority();

        extraClaims.put("role", role); // Add role as a separate claim

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // Keep subject clean
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7 days expiry
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserName(String token) {
        String subject = extractClaim(token, Claims::getSubject);
        return subject.split(":")[0]; // Extract username only
    }

    // Add method to extract role
    public String extractUserRole(String token) {
        String subject = extractClaim(token, Claims::getSubject);
        return subject.contains(":") ? subject.split(":")[1] : "USER"; // Extract role
    }

    //to extract username ,we need this claim here means data
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //token validity
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token).split("/")[0]; // Extract only the email

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
