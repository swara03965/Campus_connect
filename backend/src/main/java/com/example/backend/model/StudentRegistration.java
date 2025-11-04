package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations") // Tells JPA the correct table name
public class StudentRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This field maps to the 'user_email' column in your database
    @Column(name = "user_email")
    private String email;

    // This field maps to the 'event_id' column in your database
    @Column(name = "event_id")
    private Long eventId;

    // JPA will automatically look for a 'registration_date' column
    // This assumes your table has this column. If not, you may need to map it too.
    @Column(updatable = false)
    private LocalDateTime registrationDate;

    // --- We remove name, rollNo, and eventName because they are not in this table ---

    // --- Getters and Setters ---
    // (It's better to use Lombok's @Data annotation to generate these automatically)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }
}