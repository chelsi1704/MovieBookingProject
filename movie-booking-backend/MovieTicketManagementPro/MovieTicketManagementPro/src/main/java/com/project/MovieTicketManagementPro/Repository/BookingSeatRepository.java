package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat,Long> {

    List<BookingSeat> findByBookingId(Long bookingId);

    List<BookingSeat> findByShowtimeSeatId(Long showtimeSeatId);
}
