package com.example.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data // Lombok annotation to generate getters, setters, etc.
public class RegistrationDetailDTO {
    private Long id;
    private String name;
    private String email;
   // private String rollNo;
    private LocalDateTime registrationDate;

    
}

