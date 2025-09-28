// src/main/java/com/example/registrationapi/service/StudentRegistrationServiceImpl.java

package com.example.backend.service;

import com.example.backend.model.StudentRegistration;
import com.example.backend.repository.StudentRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentRegistrationServiceImpl implements StudentRegistrationService {

    private final StudentRegistrationRepository registrationRepository;

    @Autowired
    public StudentRegistrationServiceImpl(StudentRegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    @Override
    public List<StudentRegistration> getAllRegistrations() {
        // The logic is to simply call the repository's method.
        // More complex business logic (e.g., validation) would go here.
        return registrationRepository.findAll();
    }

    @Override
    public StudentRegistration createRegistration(StudentRegistration registration) {
        // Here you could add logic like checking for duplicates,
        // validating data, etc., before saving.
        return registrationRepository.save(registration);
    }
}