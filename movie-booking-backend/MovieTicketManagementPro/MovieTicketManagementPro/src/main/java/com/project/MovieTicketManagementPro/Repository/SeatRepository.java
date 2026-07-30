package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Seat;
import com.project.MovieTicketManagementPro.model.SeatCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByScreenIdAndIsActive(Long screenId, boolean isActive);

    List<Seat> findByScreenIdAndCategoryAndIsActive(
            Long screenId,
            SeatCategory category,
            boolean isActive
    );

    @Query("SELECT s.category, COUNT(s) FROM Seat s WHERE s.screen.id = :screenId GROUP BY s.category")
    List<Object[]> countSeatsByCategory(@Param("screenId") Long screenId);

    boolean existsByScreenIdAndRowLabelAndSeatNumber(
            Long screenId,
            String rowLabel,
            Integer seatNumber
    );
}
