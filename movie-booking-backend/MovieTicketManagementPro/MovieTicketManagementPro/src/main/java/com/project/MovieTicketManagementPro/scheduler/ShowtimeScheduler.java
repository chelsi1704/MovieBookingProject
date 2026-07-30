package com.project.MovieTicketManagementPro.scheduler;

import com.project.MovieTicketManagementPro.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShowtimeScheduler {

    private final ShowtimeService showtimeService;

    @Scheduled(fixedDelay = 60_000)
    public void releaseExpiredSeatLocks() {
        log.debug("Running scheduled task: releaseExpiredSeatLocks");
        try {
            showtimeService.releaseExpiredSeatLocks();
        } catch (Exception e) {
            log.error("Error releasing seat locks: {}", e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void completePastShowtimes() {
        log.info("Running scheduled task: completePastShowtimes");
        try {
            showtimeService.completePastShowtimes();
        } catch (Exception e) {
            log.error("Error completing past showtimes: {}", e.getMessage());
        }
    }
}
