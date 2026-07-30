package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);

    Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId);


    @Query("""
        SELECT SUM(p.amount) FROM Payment p
        WHERE p.status = 'SUCCESS'
        AND p.paidAt BETWEEN :start AND :end
        """)
    Double sumSuccessfulPayments(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    @Query("SELECT p.method, COUNT(p), SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS' GROUP BY p.method")
    List<Object[]> getPaymentMethodBreakdown();
}
