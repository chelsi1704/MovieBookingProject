package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.TheaterAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterAmenityRepository extends JpaRepository<TheaterAmenity,Long> {

    List<TheaterAmenity> findByTheaterId(Long theaterId);

    void deleteByTheaterId(Long theaterId);
}
