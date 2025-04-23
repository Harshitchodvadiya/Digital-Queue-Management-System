package com.codewithprojects.springsecurity.services;

import com.codewithprojects.springsecurity.entities.Notification;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface NotificationService {

    void sendNotification(Long userId, String message);

    List<Notification> getNotificationHistory(Long userId);

    SseEmitter subscribe(Long userId);

    void markAllAsRead(Long userId);

    void markNotificationAsRead(Long notificationId, Long userId);

}
