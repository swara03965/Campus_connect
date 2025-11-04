package com.example.backend.controller;

import com.example.backend.model.Student;
import com.example.backend.model.StudentRegistration;
import com.example.backend.model.RegistrationDetailDTO;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.StudentRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:3000") // Allows your React app to call this API
public class StudentRegistrationController {

    @Autowired
    private StudentRegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ... (Your other POST mapping for creating a registration) ...

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationDetailDTO>> getRegistrationsByEvent(@PathVariable Long eventId) {
        List<StudentRegistration> registrations = registrationRepository.findByEventId(eventId);
        List<RegistrationDetailDTO> detailedRegistrations = new ArrayList<>();

        for (StudentRegistration reg : registrations) {
            Optional<Student> studentOpt = studentRepository.findByEmail(reg.getEmail());
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                
                // Create a DTO and combine the data from both tables
                RegistrationDetailDTO dto = new RegistrationDetailDTO();
                dto.setId(reg.getId());
                dto.setName(student.getName());
                dto.setEmail(student.getEmail());

                dto.setRegistrationDate(reg.getRegistrationDate());
                
                detailedRegistrations.add(dto);
            }
        }
        
        return ResponseEntity.ok(detailedRegistrations);
    }
}