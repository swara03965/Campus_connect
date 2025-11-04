package com.example.backend.service;

import com.example.backend.model.StudentRegistration;
import com.example.backend.repository.StudentRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Marks this as the service implementation
public class StudentRegistrationServiceImpl implements StudentRegistrationService {

    @Autowired // Injects the repository
    private StudentRegistrationRepository studentRegistrationRepository;

    @Override
    public List<StudentRegistration> getAllRegistrations() {
        return studentRegistrationRepository.findAll();
    }

    @Override
    public StudentRegistration createRegistration(StudentRegistration registration) {
        // You might have more logic here, like checking for duplicates
        return studentRegistrationRepository.save(registration);
    }
    
    // --- IMPLEMENT THE NEW METHOD HERE ---
    @Override
    public List<StudentRegistration> getRegistrationsByEventId(Long eventId) {
        // This calls the repository method you created earlier
        return studentRegistrationRepository.findByEventId(eventId);
    }
}