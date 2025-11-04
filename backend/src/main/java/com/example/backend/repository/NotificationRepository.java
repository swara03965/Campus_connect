package com.example.backend.repository;

import com.example.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Finds all notifications for a specific user, ordered by newest first
    List<Notification> findByUserEmailOrderByTimestampDesc(String userEmail);

    // Finds all unread notifications for a user
    List<Notification> findByUserEmailAndIsReadFalse(String userEmail);
}