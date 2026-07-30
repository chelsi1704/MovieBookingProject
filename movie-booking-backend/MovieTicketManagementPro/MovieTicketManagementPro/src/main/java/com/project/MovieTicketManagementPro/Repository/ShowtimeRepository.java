package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Showtime;
import com.project.MovieTicketManagementPro.model.ShowtimeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    @Query("""
        SELECT sh FROM Showtime sh
        JOIN sh.screen sc
        JOIN sc.theater t
        WHERE sh.movie.id = :movieId
        AND sh.showDate = :showDate
        AND LOWER(t.city) = LOWER(:city)
        AND sh.status = 'SCHEDULED'
        AND t.isActive = true
        ORDER BY sh.startTime ASC
        """)
    List<Showtime> findShowtimesForMovieInCity(
            @Param("movieId") Long movieId,
            @Param("showDate") LocalDate showDate,
            @Param("city") String city
    );

    List<Showtime> findByScreenTheaterIdAndShowDateAndStatusOrderByStartTimeAsc(
            Long theaterId,
            LocalDate showDate,
            ShowtimeStatus status
    );

    @Query("""
        SELECT COUNT(sh) > 0 FROM Showtime sh
        WHERE sh.screen.id = :screenId
        AND sh.showDate = :showDate
        AND sh.status = 'SCHEDULED'
        AND sh.startTime < :endTime
        AND sh.endTime > :startTime
        """)
    boolean existsConflictingShowtime(
            @Param("screenId") Long screenId,
            @Param("showDate") LocalDate showDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("""
        SELECT DISTINCT sh.showDate FROM Showtime sh
        JOIN sh.screen sc
        JOIN sc.theater t
        WHERE sh.movie.id = :movieId
        AND LOWER(t.city) = LOWER(:city)
        AND sh.status = 'SCHEDULED'
        AND sh.showDate >= :fromDate
        ORDER BY sh.showDate ASC
        """)
    List<LocalDate> findAvailableDatesForMovie(
            @Param("movieId") Long movieId,
            @Param("city") String city,
            @Param("fromDate") LocalDate fromDate
    );

    List<Showtime> findByScreenIdOrderByShowDateAscStartTimeAsc(Long screenId);

    @Query("""
        SELECT sh FROM Showtime sh
        WHERE sh.status = 'SCHEDULED'
        AND sh.showDate < :today
        """)
    List<Showtime> findPastScheduledShowtimes(@Param("today") LocalDate today);
}
