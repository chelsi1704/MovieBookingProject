package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {

    List<Screen> findByTheaterIdAndIsActive(Long theaterId, boolean isActive);

    @Query("""
        SELECT sc FROM Screen sc
        WHERE sc.theater.id = :theaterId
        AND sc.isActive = true
        AND sc.id NOT IN (
            SELECT sh.screen.id FROM Showtime sh
            WHERE sh.screen.theater.id = :theaterId
            AND sh.showDate = :showDate
            AND sh.status = 'SCHEDULED'
            AND (
                (sh.startTime < :endTime AND sh.endTime > :startTime)
            )
        )
        """)
    List<Screen> findAvailableScreens(
            @Param("theaterId") Long theaterId,
            @Param("showDate") LocalDate showDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    Long countByTheaterIdAndIsActive(Long theaterId, boolean isActive);

}
