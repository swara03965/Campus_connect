// src/main/java/com/example/registrationapi/repository/StudentRegistrationRepository.java

package com.example.backend.repository;

import com.example.backend.model.StudentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRegistrationRepository extends JpaRepository<StudentRegistration, Long> {
    // All CRUD methods (findAll(), save(), etc.) are provided automatically.
}