package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Movie;
import com.project.MovieTicketManagementPro.model.MovieStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository
        extends JpaRepository<Movie, Long>,
        JpaSpecificationExecutor<Movie> {


    List<Movie> findByStatus(MovieStatus status);

    List<Movie> findByTitleContainingIgnoreCaseAndStatus(
            String title, MovieStatus status);

    @Query("""
        SELECT DISTINCT m FROM Movie m
        JOIN m.languages l
        WHERE l.id = :languageId
        AND m.status = :status
        """)
    List<Movie> findByLanguageAndStatus(
            @Param("languageId") Long languageId,
            @Param("status") MovieStatus status);

    @Query("""
        SELECT DISTINCT m FROM Movie m
        JOIN m.genres g
        WHERE g.id = :genreId
        AND m.status = :status
        """)
    List<Movie> findByGenreAndStatus(
            @Param("genreId") Long genreId,
            @Param("status") MovieStatus status);

    List<Movie> findByStatusOrderByAvgRatingDesc(MovieStatus status);

    List<Movie> findByStatusOrderByReleaseDateAsc(MovieStatus status);

    boolean existsByTitleAndReleaseDate(
            String title, LocalDate releaseDate);

    @Query("""
        SELECT DISTINCT m FROM Movie m
        LEFT JOIN m.genres g
        LEFT JOIN m.languages l
        WHERE (:title IS NULL OR
               LOWER(m.title) LIKE LOWER(CONCAT('%',:title,'%')))
        AND (:genreId IS NULL OR g.id = :genreId)
        AND (:languageId IS NULL OR l.id = :languageId)
        AND (:status IS NULL OR m.status = :status)
        """)
    Page<Movie> searchMovies(
            @Param("title") String title,
            @Param("genreId") Long genreId,
            @Param("languageId") Long languageId,
            @Param("status") MovieStatus status,
            Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r " +
            "WHERE r.movie.id = :movieId " +
            "AND r.isApproved = true")
    Double calculateAvgRating(@Param("movieId") Long movieId);

    @Query("SELECT m.status, COUNT(m) " +
            "FROM Movie m GROUP BY m.status")
    List<Object[]> countMoviesByStatus();
}