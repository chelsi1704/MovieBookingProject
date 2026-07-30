package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Review;
import com.project.MovieTicketManagementPro.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {

    List<Review> findByMovieIdAndIsApprovedOrderByCreatedAtDesc(
            Long movieId,
            boolean isApproved
    );

    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Review> findByIsApprovedOrderByCreatedAtAsc(boolean isApproved);

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movie.id = :movieId AND r.isApproved = true")
    Double getAverageRatingForMovie(@Param("movieId") Long movieId);

    @Query("""
        SELECT r.rating, COUNT(r) FROM Review r
        WHERE r.movie.id = :movieId AND r.isApproved = true
        GROUP BY r.rating ORDER BY r.rating DESC
        """)
    List<Object[]> getRatingDistribution(@Param("movieId") Long movieId);
}
