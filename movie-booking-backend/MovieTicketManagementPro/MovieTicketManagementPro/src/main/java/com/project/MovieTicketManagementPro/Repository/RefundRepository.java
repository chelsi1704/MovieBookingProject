package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Refund;
import com.project.MovieTicketManagementPro.model.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {

    Optional<Refund> findByGatewayRefundId(String gatewayRefundId);

    Optional<Refund> findByBookingId(Long bookingId);

    List<Refund> findByStatus(RefundStatus status);

    @Query("""
        SELECT SUM(r.refundAmount) FROM Refund r
        WHERE r.status = 'PROCESSED'
        AND r.refundedAt BETWEEN :start AND :end
        """)
    Double sumProcessedRefunds(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
