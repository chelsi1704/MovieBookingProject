package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Booking;
import com.project.MovieTicketManagementPro.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    Optional<Booking> findByBookingRef(String bookingRef);

    List<Booking> findByShowtimeId(Long showtimeId);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.status = 'PENDING'
        AND b.expiresAt < :now
        """)
    List<Booking> findExpiredPendingBookings(@Param("now") LocalDateTime now);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.bookedAt BETWEEN :start AND :end
        AND b.status = :status
        """)
    List<Booking> findByDateRangeAndStatus(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") BookingStatus status
    );

    @Query("""
        SELECT SUM(b.totalAmount) FROM Booking b
        WHERE b.status = 'CONFIRMED'
        AND b.bookedAt BETWEEN :start AND :end
        """)
    Double calculateRevenueBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT b.showtime.movie.title, SUM(b.totalAmount)
        FROM Booking b
        WHERE b.status = 'CONFIRMED'
        GROUP BY b.showtime.movie.id, b.showtime.movie.title
        ORDER BY SUM(b.totalAmount) DESC
        """)
    List<Object[]> getRevenuePerMovie();

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.user.id = :userId
        AND b.showtime.movie.id = :movieId
        AND b.status = 'CONFIRMED'
        """)
    boolean hasUserWatchedMovie(
            @Param("userId") Long userId,
            @Param("movieId") Long movieId
    );

    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> countBookingsByStatus();

}
