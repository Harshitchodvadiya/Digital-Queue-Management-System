//package com.codewithprojects.springsecurity.controller;
//
//import org.springframework.http.MediaType;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
//
//import java.io.IOException;
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.concurrent.CopyOnWriteArrayList;
//
//@RequestMapping("/api/v1/notifications")
//@RestController
//public class NotificationController {
//
//    private final ConcurrentHashMap<Long, CopyOnWriteArrayList<SseEmitter>> userEmitters = new ConcurrentHashMap<>();
//
//    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public SseEmitter subscribe(@PathVariable Long userId) {
//        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
//
//        userEmitters.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);
//
//        emitter.onCompletion(() -> userEmitters.get(userId).remove(emitter));
//        emitter.onTimeout(() -> userEmitters.get(userId).remove(emitter));
//
//        return emitter;
//    }
//
//    public void sendNotification(Long userId, String message) {
//        if (userEmitters.containsKey(userId)) {
//            for (SseEmitter emitter : userEmitters.get(userId)) {
//                try {
//                    emitter.send(SseEmitter.event().data(message));
//                } catch (IOException e) {
//                    emitter.complete();
//                }
//            }
//        }
//    }
//}

package com.codewithprojects.springsecurity.controller;

import com.codewithprojects.springsecurity.entities.Notification;
import com.codewithprojects.springsecurity.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Subscribe a user to SSE notifications.
     */
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long userId)   {
        return notificationService.subscribe(userId);
    }


    @GetMapping("/history/{userId}")
    public List<Notification> getUserNotificationHistory(@PathVariable Long userId) {
        return notificationService.getNotificationHistory(userId);
    }

    @PutMapping("/mark-all-read/{userId}")
    public void markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
    }

    @PutMapping("/mark-read/{userId}/{notificationId}")
    public void markNotificationAsRead(@PathVariable Long userId,@PathVariable Long notificationId) {
        notificationService.markNotificationAsRead(notificationId, userId);
    }

}
