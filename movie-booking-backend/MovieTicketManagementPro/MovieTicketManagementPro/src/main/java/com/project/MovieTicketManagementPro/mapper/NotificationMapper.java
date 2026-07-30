package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.NotificationResponse;
import com.project.MovieTicketManagementPro.model.Notification;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .timeAgo(computeTimeAgo(notification.getCreatedAt()))
                .build();
    }

    private String computeTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) return "";

        Duration duration = Duration.between(createdAt, LocalDateTime.now());

        if (duration.toMinutes() < 1) return "Just now";
        if (duration.toMinutes() < 60)
            return duration.toMinutes() + " minute"
                    + (duration.toMinutes() == 1 ? "" : "s") + " ago";
        if (duration.toHours() < 24)
            return duration.toHours() + " hour"
                    + (duration.toHours() == 1 ? "" : "s") + " ago";
        if (duration.toDays() < 30)
            return duration.toDays() + " day"
                    + (duration.toDays() == 1 ? "" : "s") + " ago";

        return createdAt.toLocalDate().toString(); // fallback to date string
    }
}
