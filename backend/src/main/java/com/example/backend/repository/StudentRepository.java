package com.example.backend.repository;

import com.example.backend.model.AccountStatus;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);
    
    // --- ADD THIS LINE ---
    // This declares the method so your controller can use it.
    // Spring Data JPA will automatically create the implementation.
    List<Student> findByStatus(AccountStatus status);
}