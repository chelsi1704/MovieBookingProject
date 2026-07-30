package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.MovieImage;
import com.project.MovieTicketManagementPro.model.MovieImageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieImageRepository extends JpaRepository<MovieImage,Long> {

    List<MovieImage> findByMovieId(Long movieId);

    List<MovieImage> findByMovieIdAndType(Long movieId, MovieImageType type);

    void deleteByMovieId(Long movieId);
}
