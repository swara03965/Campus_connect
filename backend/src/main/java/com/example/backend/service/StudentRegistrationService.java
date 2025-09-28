// src/main/java/com/example/registrationapi/service/StudentRegistrationService.java

package com.example.backend.service;

import com.example.backend.model.StudentRegistration;
import java.util.List;

public interface StudentRegistrationService {
    /**
     * Retrieves all student registrations.
     * @return a list of all registrations.
     */
    List<StudentRegistration> getAllRegistrations();

    /**
     * Creates and saves a new student registration.
     * @param registration The registration object to save.
     * @return The saved registration object with its new ID.
     */
    StudentRegistration createRegistration(StudentRegistration registration);
}