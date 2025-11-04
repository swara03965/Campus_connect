package com.example.backend.controller;

import com.example.backend.model.Notification;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Allows your React app to connect
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Gets all notifications for a specific user, ordered by the newest first.
     */
    @GetMapping("/{userEmail}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String userEmail) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userEmail);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Marks a single notification as read.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationService.markNotificationAsRead(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Marks all notifications for a user as read.
     */
    @PutMapping("/read-all/{userEmail}")
    public ResponseEntity<List<Notification>> markAllAsRead(@PathVariable String userEmail) {
        List<Notification> updatedNotifications = notificationService.markAllNotificationsAsRead(userEmail);
        return ResponseEntity.ok(updatedNotifications);
    }
    
    /**
     * Deletes a single notification by its ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotificationById(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes all notifications for a specific user.
     */
    @DeleteMapping("/clear-all/{userEmail}")
    public ResponseEntity<Void> clearAllNotifications(@PathVariable String userEmail) {
        notificationService.deleteAllNotificationsForUser(userEmail);
        return ResponseEntity.ok().build();
    }
}