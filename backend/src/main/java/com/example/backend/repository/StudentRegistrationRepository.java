package com.example.backend.repository;

import com.example.backend.model.StudentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRegistrationRepository extends JpaRepository<StudentRegistration, Long> {

    /**
     * Finds all registrations for a specific event by its ID.
     * The eventId parameter is now a Long to match the database table.
     */
    List<StudentRegistration> findByEventId(Long eventId);

    /**
     * Checks if a specific student is already registered for an event
     * to prevent duplicate entries.
     */
    Optional<StudentRegistration> findByEmailAndEventId(String email, Long eventId);
}