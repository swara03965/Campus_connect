package com.example.backend.service;

import com.example.backend.model.Notification;
import com.example.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Method to create and save a new notification
    public void createNotification(String userEmail, String title, String message, String type) {
        Notification notification = new Notification(userEmail, title, message, type);
        notificationRepository.save(notification);
    }

    // --- METHODS FOR THE CONTROLLER ---

    public List<Notification> getNotificationsForUser(String userEmail) {
        return notificationRepository.findByUserEmailOrderByTimestampDesc(userEmail);
    }

    public Optional<Notification> markNotificationAsRead(Long id) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            return Optional.of(notificationRepository.save(notification));
        }
        return Optional.empty();
    }

    @Transactional
    public List<Notification> markAllNotificationsAsRead(String userEmail) {
        List<Notification> unreadNotifications = notificationRepository.findByUserEmailAndIsReadFalse(userEmail);
        
        unreadNotifications.forEach(notification -> notification.setRead(true));
        
        return notificationRepository.saveAll(unreadNotifications);
    }

    public void deleteNotificationById(Long id) {
        notificationRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllNotificationsForUser(String userEmail) {
        List<Notification> userNotifications = notificationRepository.findByUserEmailOrderByTimestampDesc(userEmail);
        notificationRepository.deleteAll(userNotifications);
    }
}