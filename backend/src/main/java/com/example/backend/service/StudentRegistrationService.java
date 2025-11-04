package com.example.backend.service;

import com.example.backend.model.StudentRegistration;
import java.util.List;

public interface StudentRegistrationService {
    
    List<StudentRegistration> getAllRegistrations();

    StudentRegistration createRegistration(StudentRegistration registration);
    
    // --- ADD THIS METHOD DEFINITION ---
    /**
     * Retrieves all registrations for a specific event.
     * @param eventId The ID of the event.
     * @return A list of registrations for that event.
     */
    List<StudentRegistration> getRegistrationsByEventId(Long eventId);
}