package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.mapper.NotificationMapper;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.model.NotificationType;
import com.project.MovieTicketManagementPro.service.NotificationService;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final SecurityUtil securityUtil;

    @Override
    public void sendBookingConfirmedNotification(Booking booking) {
        saveNotification(
                booking.getUser(),
                "Booking Confirmed!",
                "Your booking " + booking.getBookingRef()
                        + " for " + booking.getShowtime().getMovie().getTitle()
                        + " is confirmed. Enjoy the show!",
                NotificationType.BOOKING);
    }

    @Override
    public void sendBookingCancelledNotification(Booking booking) {
        saveNotification(
                booking.getUser(),
                "Booking Cancelled",
                "Your booking " + booking.getBookingRef()
                        + " has been cancelled. Refund will be processed "
                        + "in 5-7 business days.",
                NotificationType.BOOKING);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<NotificationResponse>>
    getMyNotifications(Pageable pageable) {
        Long userId = securityUtil.getCurrentUserId();
        List<NotificationResponse> notifications =
                notificationRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                userId, pageable)
                        .stream()
                        .map(notificationMapper::toResponse)
                        .collect(Collectors.toList());
        return ApiResponse.success(
                "Notifications fetched.", notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<UnreadCountResponse> getUnreadCount() {
        Long userId = securityUtil.getCurrentUserId();
        Long count = notificationRepository
                .countByUserIdAndIsRead(userId, false);
        return ApiResponse.success(
                "Unread count fetched.",
                UnreadCountResponse.builder()
                        .unreadCount(count).build());
    }

    @Override
    public ApiResponse<String> markAllAsRead() {
        Long userId = securityUtil.getCurrentUserId();
        notificationRepository.markAllAsReadForUser(userId);
        return ApiResponse.success(
                "All notifications marked as read.", null);
    }

    private void saveNotification(User user, String title,
                                  String message,
                                  NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}