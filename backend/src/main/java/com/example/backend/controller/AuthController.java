package com.example.backend.controller;

import com.example.backend.model.AccountStatus;
import com.example.backend.model.PrAdmin;
import com.example.backend.model.Student;
import com.example.backend.repository.PrAdminRepository;
import com.example.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

// A simple record to represent the incoming request JSON for authentication
record AuthRequest(String email, String password) {}

@RestController
@RequestMapping("/api") // Base URL for this controller
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PrAdminRepository prAdminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * API Endpoint to create a new student account.
     * Handles POST requests to /api/register/student
     */
    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody AuthRequest request) {
        // 1. Check if a student with this email already exists
        if (studentRepository.findByEmail(request.email()).isPresent() || prAdminRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(Map.of("message", "Email is already in use."));
        }

        // 2. Create and save the new student
        Student student = new Student();
        student.setEmail(request.email());
        student.setPassword(passwordEncoder.encode(request.password())); // Hash the password
        student.setRole("student");
        student.setName(request.email().split("@")[0]);
        
        // --- CHANGE ---
        // Set the default status to PENDING for new registrations.
        student.setStatus(AccountStatus.PENDING);

        studentRepository.save(student);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(Map.of("message", "Registration successful. Your account is pending approval."));
    }

    /**
     * API Endpoint to log in a student.
     * Handles POST requests to /api/login/student
     */
    @PostMapping("/login/student")
    public ResponseEntity<?> loginStudent(@RequestBody AuthRequest request) {
        Optional<Student> studentOptional = studentRepository.findByEmail(request.email());

        if (studentOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "Invalid credentials."));
        }

        Student student = studentOptional.get();

        // Check if the provided password matches the stored hash
        if (passwordEncoder.matches(request.password(), student.getPassword())) {
            
            // --- CHANGE ---
            // After password is correct, check if the account is approved.
            if (student.getStatus() != AccountStatus.APPROVED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN) // 403 Forbidden
                                     .body(Map.of("message", "Your account has not been approved yet."));
            }

            // Passwords match and account is approved!
            Map<String, String> userDetails = Map.of(
                "name", student.getName(),
                "email", student.getEmail(),
                "role", student.getRole()
            );
            return ResponseEntity.ok(userDetails);
        } else {
            // Passwords do not match.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "Invalid credentials."));
        }
    }

    /**
     * API Endpoint to log in a PR Admin.
     * Handles POST requests to /api/login/pr-admin
     */
    @PostMapping("/login/pr-admin")
    public ResponseEntity<?> loginPrAdmin(@RequestBody AuthRequest request) {
        Optional<PrAdmin> prAdminOptional = prAdminRepository.findByEmail(request.email());

        if (prAdminOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials."));
        }

        PrAdmin prAdmin = prAdminOptional.get();

        if (passwordEncoder.matches(request.password(), prAdmin.getPassword())) {
            Map<String, String> userDetails = Map.of(
                "name", prAdmin.getName(),
                "email", prAdmin.getEmail(),
                "role", prAdmin.getRole()
            );
            return ResponseEntity.ok(userDetails);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials."));
        }
    }
}