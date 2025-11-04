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
    private String status = "DRAFT"; // Use uppercase for consistency with enums
    private String createdBy;

    @ElementCollection(fetch = FetchType.EAGER) // EAGER fetch for simplicity here
    @CollectionTable(name = "event_registrations", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "user_email")
    private Set<String> registeredUsers = new HashSet<>();

    /**
     * Dynamically calculates the number of attendees based on the size of the set.
     * There is no 'setAttendees' because the count is managed by adding/removing users.
     * @return The current number of registered users.
     */
    public Integer getAttendees() {
        return registeredUsers.size();
    }

    /**
     * --- NEW ---
     * Helper method to add a user to the registration list.
     * @param userEmail The email of the user to register.
     */
    public void registerUser(String userEmail) {
        this.registeredUsers.add(userEmail);
    }

    /**
     * --- NEW ---
     * Helper method to remove a user from the registration list.
     * @param userEmail The email of the user to unregister.
     */
    public void unregisterUser(String userEmail) {
        this.registeredUsers.remove(userEmail);
    }
}