package com.codewithprojects.springsecurity.config;


import com.codewithprojects.springsecurity.services.JWTService;
import com.codewithprojects.springsecurity.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // allows the request to pass through without authentication if below is true
        if(StringUtils.isEmpty(authHeader)|| !org.apache.commons.lang3.StringUtils.startsWith(authHeader,"Bearer")){

            //hands over the request processing to the next filter.
            filterChain.doFilter(request,response);
            return;
        }

        //get token starts after Bearer
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUserName(jwt);


        //Checks if the user is already authenticated or if the token contains a valid username.
        if(io.micrometer.common.util.StringUtils.isNotEmpty(userEmail) || SecurityContextHolder.getContext().getAuthentication()==null){
            // if either condition is true, it proceeds to validate the user.

            //fetch the user details based on username
            UserDetails userDetails = userService.userDetailsService().loadUserByUsername(userEmail);

            if(jwtService.isTokenValid(jwt,userDetails)){
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        userDetails,null,userDetails.getAuthorities()
                );

                //This associates the request's IP address, session ID, etc. with the authentication object.
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //The authenticated user is now stored in SecurityContextHolder,
                // which Spring Security uses for authorization.
                securityContext.setAuthentication(token);
                SecurityContextHolder.setContext(securityContext);
            }

        }
        filterChain.doFilter(request,response);

    }
}
