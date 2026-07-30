package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater,Long> {

    List<Theater> findByCityIgnoreCaseAndIsActive(String city, boolean isActive);

    List<Theater> findByOwnerIdAndIsActive(Long ownerId, boolean isActive);

    @Query("""
        SELECT t FROM Theater t
        WHERE t.isActive = true
        AND (6371 * ACOS(
            COS(RADIANS(:lat)) * COS(RADIANS(t.latitude)) *
            COS(RADIANS(t.longitude) - RADIANS(:lng)) +
            SIN(RADIANS(:lat)) * SIN(RADIANS(t.latitude))
        )) <= :radiusKm
        ORDER BY (6371 * ACOS(
            COS(RADIANS(:lat)) * COS(RADIANS(t.latitude)) *
            COS(RADIANS(t.longitude) - RADIANS(:lng)) +
            SIN(RADIANS(:lat)) * SIN(RADIANS(t.latitude))
        )) ASC
        """)
    List<Theater> findNearbyTheaters(
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radiusKm") Double radiusKm
    );

    @Query("""
        SELECT DISTINCT t FROM Theater t
        JOIN t.screens sc
        JOIN sc.showtimes sh
        WHERE sh.movie.id = :movieId
        AND LOWER(t.city) = LOWER(:city)
        AND t.isActive = true
        AND sh.showDate = :showDate
        AND sh.status = 'SCHEDULED'
        """)
    List<Theater> findTheatersShowingMovie(
            @Param("movieId") Long movieId,
            @Param("city") String city,
            @Param("showDate") LocalDate showDate
    );

    boolean existsByNameIgnoreCaseAndCityIgnoreCase(String name, String city);

}
