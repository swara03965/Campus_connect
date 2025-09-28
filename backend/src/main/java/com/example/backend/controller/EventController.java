package com.example.backend.controller;

import com.example.backend.model.Event;
import com.example.backend.repository.EventRepository;
import com.example.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventRepository eventRepository;
    private final EventService eventService;

    @GetMapping("/all")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    @GetMapping
    public List<Event> getPublishedEvents() {
        return eventRepository.findByStatus("published");
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }
    
    @PutMapping("/{id}/publish")
    public Event publishEvent(@PathVariable Long id) {
        return eventService.publishEvent(id);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<String> registerForEvent(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        boolean success = eventService.registerForEvent(id, payload.get("email"));
        if (success) {
            return ResponseEntity.ok("Registered successfully");
        }
        return ResponseEntity.badRequest().body("Registration failed");
    }

    @PostMapping("/{id}/unregister")
    public ResponseEntity<String> unregisterFromEvent(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        eventService.unregisterFromEvent(id, payload.get("email"));
        return ResponseEntity.ok("Unregistered successfully");
    }
}