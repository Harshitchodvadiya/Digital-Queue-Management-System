package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.Notification;
import com.codewithprojects.springsecurity.repository.NotificationRepository;
import com.codewithprojects.springsecurity.services.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ConcurrentHashMap<Long, CopyOnWriteArrayList<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Subscribe a user for SSE notifications.
     */
    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        userEmitters.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> userEmitters.get(userId).remove(emitter));
        emitter.onTimeout(() -> userEmitters.get(userId).remove(emitter));

        return emitter;
    }

    /**
     * Send a notification to a specific user.
     */

    public void sendNotification(Long userId, String message) {
        // Save the notification in the database
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);

        // Send the notification in real-time via SSE
        if (userEmitters.containsKey(userId)) {
            for (SseEmitter emitter : userEmitters.get(userId)) {
                try {
                    emitter.send(SseEmitter.event().data(message));
                } catch (IOException e) {
                    emitter.complete();
                }
            }
        }
    }

    // Get notification history for a user
    public List<Notification> getNotificationHistory(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

}
