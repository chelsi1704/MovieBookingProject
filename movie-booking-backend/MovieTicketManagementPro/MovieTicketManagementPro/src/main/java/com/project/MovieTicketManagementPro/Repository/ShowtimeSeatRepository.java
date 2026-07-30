package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.SeatStatus;
import com.project.MovieTicketManagementPro.model.ShowtimeSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, Long> {

    List<ShowtimeSeat> findByShowtimeId(Long showtimeId);

    List<ShowtimeSeat> findByIdInAndShowtimeId(List<Long> ids, Long showtimeId);

    Long countByShowtimeIdAndStatus(Long showtimeId, SeatStatus status);

    @Query("""
        SELECT ss FROM ShowtimeSeat ss
        WHERE ss.status = 'LOCKED'
        AND ss.lockExpiresAt < :now
        """)
    List<ShowtimeSeat> findExpiredLockedSeats(@Param("now") LocalDateTime now);

    @Query("""
        SELECT COUNT(ss) FROM ShowtimeSeat ss
        WHERE ss.id IN :ids
        AND ss.status = 'AVAILABLE'
        """)
    Long countAvailableByIds(@Param("ids") List<Long> ids);

    List<ShowtimeSeat> findByShowtimeIdAndLockedByUserId(Long showtimeId, Long userId);

    @Query("""
    SELECT bs.showtimeSeat FROM BookingSeat bs
    WHERE bs.booking.id = :bookingId
    """)
    List<ShowtimeSeat> findByBookingId(@Param("bookingId") Long bookingId);
    @Query("""
        SELECT ss.seat.category, ss.status, COUNT(ss)
        FROM ShowtimeSeat ss
        WHERE ss.showtime.id = :showtimeId
        GROUP BY ss.seat.category, ss.status
        """)
    List<Object[]> getSeatStatsByShowtime(@Param("showtimeId") Long showtimeId);
}
