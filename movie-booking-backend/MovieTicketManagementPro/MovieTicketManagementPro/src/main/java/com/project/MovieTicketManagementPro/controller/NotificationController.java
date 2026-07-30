package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>>
    getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                notificationService.getMyNotifications(
                        PageRequest.of(page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<UnreadCountResponse>>
    getUnreadCount() {
        return ResponseEntity.ok(
                notificationService.getUnreadCount());
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<String>> markAllRead() {
        return ResponseEntity.ok(
                notificationService.markAllAsRead());
    }
}