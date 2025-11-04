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

import java.util.List;
import java.util.Map;

// A simple record for the PR Admin creation request
record PrAdminRequest(String name, String email, String password) {}

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private StudentRepository studentRepository;

    // --- NEW: Inject PrAdminRepository and PasswordEncoder ---
    @Autowired
    private PrAdminRepository prAdminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- Student Management Endpoints (Unchanged) ---

    @GetMapping("/pending-students")
    public List<Student> getPendingStudents() {
        return studentRepository.findByStatus(AccountStatus.PENDING);
    }

    @PostMapping("/students/{id}/approve")
    public ResponseEntity<?> approveStudent(@PathVariable Long id) {
        return studentRepository.findById(id).map(student -> {
            student.setStatus(AccountStatus.APPROVED);
            studentRepository.save(student);
            return ResponseEntity.ok(Map.of("message", "Student approved successfully."));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/students/{id}/reject")
    public ResponseEntity<?> rejectStudent(@PathVariable Long id) {
        return studentRepository.findById(id).map(student -> {
            studentRepository.delete(student);
            return ResponseEntity.ok(Map.of("message", "Student rejected and removed."));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all-students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // --- NEW: PR Admin Management Endpoints ---

    /**
     * API Endpoint to create a new PR Admin account.
     * This is called from the Main Admin Dashboard.
     */
    @PostMapping("/pr-admins")
    public ResponseEntity<?> createPrAdmin(@RequestBody PrAdminRequest request) {
        // Check if email exists in either students or other pr-admins to ensure uniqueness
        if (prAdminRepository.findByEmail(request.email()).isPresent() || studentRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email is already in use."));
        }

        PrAdmin newPrAdmin = new PrAdmin();
        newPrAdmin.setName(request.name());
        newPrAdmin.setEmail(request.email());
        newPrAdmin.setPassword(passwordEncoder.encode(request.password()));
        newPrAdmin.setRole("pr_admin"); // Assign the correct role

        PrAdmin savedAdmin = prAdminRepository.save(newPrAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
    }

    /**
     * API Endpoint to get a list of all PR Admins.
     * This is used to populate the list in the Main Admin Dashboard.
     */
    @GetMapping("/pr-admins")
    public List<PrAdmin> getAllPrAdmTins() {
        return prAdminRepository.findAll();
    }

    // --- *** NEWLY ADDED METHOD *** ---
    /**
     * API Endpoint to delete a PR Admin account by its ID.
     * This is called from the Main Admin Dashboard.
     */
    @DeleteMapping("/pr-admins/{id}")
    public ResponseEntity<?> deletePrAdmin(@PathVariable Long id) {
        // Use the repository to find the admin by their ID
        return prAdminRepository.findById(id)
            .map(admin -> {
                // If the admin is found, delete them
                prAdminRepository.delete(admin);
                // Return a 200 OK response with a success message
                return ResponseEntity.ok(Map.of("message", "PR Admin deleted successfully."));
            })
            .orElse(
                // If no admin is found with that ID, return a 404 Not Found
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                              .body(Map.of("message", "PR Admin not found with id: " + id))
            );
    }
}