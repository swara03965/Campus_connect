package com.example.backend.controller;

import com.example.backend.model.Announcement;
import com.example.backend.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {
    private final AnnouncementRepository announcementRepository;

    @GetMapping("/all")
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }
    
    @GetMapping
    public List<Announcement> getPublishedAnnouncements() {
        return announcementRepository.findByStatus("published");
    }

    @PostMapping
    public Announcement createAnnouncement(@RequestBody Announcement announcement) {
        announcement.setCreatedAt(LocalDate.now());
        return announcementRepository.save(announcement);
    }

    @PutMapping("/{id}/publish")
    public Announcement publishAnnouncement(@PathVariable Long id) {
        Announcement announcement = announcementRepository.findById(id).orElseThrow(() -> new RuntimeException("Announcement not found"));
        announcement.setStatus("published");
        announcement.setPublishedAt(LocalDate.now());
        return announcementRepository.save(announcement);
    }

    @DeleteMapping("/{id}")
    public void deleteAnnouncement(@PathVariable Long id) {
        announcementRepository.deleteById(id);
    }
}