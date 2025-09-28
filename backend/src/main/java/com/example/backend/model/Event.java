package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private String category;
    private int maxAttendees;
    private String priority;
    private String status = "draft";
    private String createdBy;

    @ElementCollection
    @CollectionTable(name = "event_registrations", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "user_email")
    private Set<String> registeredUsers = new HashSet<>();

    public Integer getAttendees() {
        return registeredUsers.size();
    }
}