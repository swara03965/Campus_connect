// src/main/java/com/example/registrationapi/controller/StudentRegistrationController.java

package com.example.backend.controller;

import com.example.backend.model.StudentRegistration;
import com.example.backend.service.StudentRegistrationService; // Import the service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/registrations")
public class StudentRegistrationController {

    // Inject the service, not the repository
    private final StudentRegistrationService registrationService;

    @Autowired
    public StudentRegistrationController(StudentRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /**
     * GET /api/registrations : Fetches all registrations
     */
    @GetMapping
    public List<StudentRegistration> getAllRegistrations() {
        // Call the service method
        return registrationService.getAllRegistrations();
    }

    /**
     * POST /api/registrations : Creates a new registration
     */
    @PostMapping
    public ResponseEntity<StudentRegistration> createRegistration(@RequestBody StudentRegistration registration) {
        // Call the service method
        StudentRegistration savedRegistration = registrationService.createRegistration(registration);
        return new ResponseEntity<>(savedRegistration, HttpStatus.CREATED);
    }
}