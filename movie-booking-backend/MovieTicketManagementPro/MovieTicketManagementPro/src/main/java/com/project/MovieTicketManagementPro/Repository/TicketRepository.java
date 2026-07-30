package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {

    List<Ticket> findByBookingId(Long bookingId);

    Optional<Ticket> findByTicketCode(String ticketCode);

    @Query("""
        SELECT t FROM Ticket t
        WHERE t.booking.showtime.id = :showtimeId
        AND t.isScanned = false
        """)
    List<Ticket> findUnscannedByShowtime(@Param("showtimeId") Long showtimeId);
}
