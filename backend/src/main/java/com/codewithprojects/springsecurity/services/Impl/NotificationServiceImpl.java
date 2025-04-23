package com.codewithprojects.springsecurity.services.Impl;

import com.codewithprojects.springsecurity.entities.Notification;
import com.codewithprojects.springsecurity.repository.NotificationRepository;
import com.codewithprojects.springsecurity.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    // Concurrent map to store SSE emitters for each user (userId -> List of emitters)
    private final ConcurrentHashMap<Long, CopyOnWriteArrayList<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

    //    This is a thread-safe map where each userId is associated with a list of active SSE emitters.
    //    Purpose: Allows multiple active SSE connections per user.


    /**
     * Subscribes a user to receive Server-Sent Events (SSE) notifications.
     * Creates a new SSE connection (SseEmitter) for the user.
     * @param userId The ID of the user subscribing to notifications.
     * @return An SseEmitter instance that keeps the connection open for real-time updates.
     */
    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Keep the connection open indefinitely.

        // Add the emitter to the list for the given user ID.
        userEmitters.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        // Remove the emitter when the connection is closed or times out.
        emitter.onCompletion(() -> userEmitters.get(userId).remove(emitter));
        emitter.onTimeout(() -> userEmitters.get(userId).remove(emitter));

        return emitter;
    }

    /**
     * Sends a notification to a specific user.
     *
     * @param userId  The ID of the user receiving the notification.
     * @param message The notification message to be sent.
     */
    public void sendNotification(Long userId, String message) {
        // Save the notification in the database for history tracking.
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        Notification saved = notificationRepository.save(notification);

        // Send the notification in real-time using SSE
        if (userEmitters.containsKey(userId)) {
            for (SseEmitter emitter : userEmitters.get(userId)) {
                try {
                    emitter.send(SseEmitter.event().data(saved));
                } catch (IOException e) {
                    // Close the emitter if sending fails
                    emitter.complete();
                }
            }
        }
    }

    /**
     * Retrieves the notification history for a user.
     *
     * @param userId The ID of the user whose notifications are being retrieved.
     * @return A list of notifications sorted in descending order of timestamp.
     */
    public List<Notification> getNotificationHistory(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
        userNotifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(userNotifications);
    }

    public void markNotificationAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Optional check for user authorization
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to this notification");
        }

        // Mark this one as read
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }


}
