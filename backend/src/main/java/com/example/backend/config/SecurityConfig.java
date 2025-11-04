package com.example.backend.config; // Or com.example.backend.controller depending on your structure

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity 
public class SecurityConfig {

    /**
     * This bean provides the password hashing tool (BCrypt) to the application.
     * Your AuthController uses this to securely hash passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * This bean configures the web security rules for your API.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disables CSRF protection, which is not needed for stateless REST APIs
            .csrf(csrf -> csrf.disable()) 
            
            // Configures URL-based authorization
            .authorizeHttpRequests(auth -> auth
                // Allows all requests to any URL starting with /api/
                .requestMatchers("/api/**").permitAll() 
                // Any other request that doesn't match the above must be authenticated
                .anyRequest().authenticated()
            );
            
        return http.build();
    }
}