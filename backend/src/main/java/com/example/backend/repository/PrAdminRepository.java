package com.example.backend.repository;

import com.example.backend.model.PrAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrAdminRepository extends JpaRepository<PrAdmin, Long> {

    /**
     * Finds a PR Admin by their email address.
     * This will be used for the PR Admin login functionality.
     * Spring Data JPA automatically creates the query for this method.
     */
    Optional<PrAdmin> findByEmail(String email);
}