package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.model.Booking;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface NotificationService {

    void sendBookingConfirmedNotification(Booking booking);
    void sendBookingCancelledNotification(Booking booking);
    ApiResponse<List<NotificationResponse>> getMyNotifications(
            Pageable pageable);
    ApiResponse<UnreadCountResponse> getUnreadCount();
    ApiResponse<String> markAllAsRead();
}