package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.OtpPurpose;
import com.project.MovieTicketManagementPro.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
            String email,
            OtpPurpose purpose
    );

    void deleteByEmailAndPurpose(String email, OtpPurpose purpose);

    void deleteAllByExpiresAtBefore(LocalDateTime now);

}
