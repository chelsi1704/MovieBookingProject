package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    boolean existsByNameIgnoreCase(String name);

    Optional<Genre> findByNameIgnoreCase(String name);

    List<Genre> findByIdIn(List<Long> ids);
}
