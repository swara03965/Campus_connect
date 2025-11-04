package com.example.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data // Lombok for getters, setters, etc.
@NoArgsConstructor // Lombok for an empty constructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail; // To know who the notification is for

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String type; // e.g., "success", "error", "info"

    private boolean isRead = false; // Default to unread

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;

    // Constructor to make creating new notifications easy
    public Notification(String userEmail, String title, String message, String type) {
        this.userEmail = userEmail;
        this.title = title;
        this.message = message;
        this.type = type;
    }
}