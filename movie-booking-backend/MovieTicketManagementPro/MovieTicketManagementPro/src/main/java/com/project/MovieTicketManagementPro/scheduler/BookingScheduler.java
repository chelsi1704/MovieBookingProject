package com.project.MovieTicketManagementPro.scheduler;

import com.project.MovieTicketManagementPro.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {

    private final BookingService bookingService;

    @Scheduled(fixedDelay = 120_000)
    public void expirePendingBookings() {
        log.debug("Running: expirePendingBookings");
        try {
            bookingService.expirePendingBookings();
        } catch (Exception e) {
            log.error("Error expiring bookings: {}", e.getMessage());
        }
    }
}