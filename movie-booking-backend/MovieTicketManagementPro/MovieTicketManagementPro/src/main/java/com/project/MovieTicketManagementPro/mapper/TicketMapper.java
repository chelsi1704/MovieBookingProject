package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.TicketResponse;
import com.project.MovieTicketManagementPro.model.*;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketResponse toResponse(Ticket ticket) {
        BookingSeat bookingSeat = ticket.getBookingSeat();
        Seat seat = bookingSeat.getShowtimeSeat().getSeat();
        Booking booking = ticket.getBooking();
        Showtime showtime = booking.getShowtime();
        Theater theater = showtime.getScreen().getTheater();
        Movie movie = showtime.getMovie();

        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .qrUrl(ticket.getQrUrl())
                .isScanned(ticket.isScanned())
                .movieTitle(movie.getTitle())
                .theaterName(theater.getName())
                .theaterAddress(theater.getAddress())
                .screenName(showtime.getScreen().getScreenName())
                .showDate(showtime.getShowDate())
                .showTime(showtime.getStartTime())
                .rowLabel(seat.getRowLabel())
                .seatNumber(seat.getSeatNumber())
                .seatCategory(seat.getCategory().name())
                .amountPaid(bookingSeat.getPriceAtBooking())
                .bookingRef(booking.getBookingRef())
                .build();
    }
}
