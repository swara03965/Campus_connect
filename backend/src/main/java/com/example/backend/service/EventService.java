package com.example.backend.service;

import com.example.backend.model.Event;
import com.example.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event publishEvent(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus("published");
        return eventRepository.save(event);
    }

    public boolean registerForEvent(Long eventId, String userEmail) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            if (event.getRegisteredUsers().size() < event.getMaxAttendees()) {
                event.getRegisteredUsers().add(userEmail);
                eventRepository.save(event);
                return true;
            }
        }
        return false;
    }

    public void unregisterFromEvent(Long eventId, String userEmail) {
        eventRepository.findById(eventId).ifPresent(event -> {
            event.getRegisteredUsers().remove(userEmail);
            eventRepository.save(event);
        });
    }
}