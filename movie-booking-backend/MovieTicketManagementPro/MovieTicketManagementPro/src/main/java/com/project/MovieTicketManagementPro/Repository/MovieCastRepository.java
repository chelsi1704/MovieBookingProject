package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.CastRoleType;
import com.project.MovieTicketManagementPro.model.MovieCast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieCastRepository extends JpaRepository<MovieCast, Long> {

    List<MovieCast> findByMovieIdOrderByBillingOrder(Long movieId);

    List<MovieCast> findByPersonId(Long personId);

    List<MovieCast> findByMovieIdAndRoleType(Long movieId, CastRoleType roleType);

    void deleteByMovieId(Long movieId);
}
