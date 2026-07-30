package com.project.MovieTicketManagementPro.scheduler;

import com.project.MovieTicketManagementPro.Repository.OtpVerificationRepository;
import com.project.MovieTicketManagementPro.Repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class OtpCleanupScheduler {

    private final OtpVerificationRepository otpRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Scheduled(fixedDelay = 3_600_000)
    public void cleanExpiredOtps() {
        log.debug("Running OTP cleanup task");
        try {
            otpRepository.deleteAllByExpiresAtBefore(LocalDateTime.now());
            log.debug("Expired OTPs cleaned up");
        } catch (Exception e) {
            log.error("Error during OTP cleanup: {}", e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 2 * * *")
    public void cleanExpiredRefreshTokens() {
        log.info("Running refresh token cleanup task");
        try {
            refreshTokenRepository.deleteAllByExpiresAtBefore(
                    LocalDateTime.now());
            log.info("Expired refresh tokens cleaned up");
        } catch (Exception e) {
            log.error("Error during refresh token cleanup: {}",
                    e.getMessage());
        }
    }
}
