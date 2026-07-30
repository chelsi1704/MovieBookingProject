package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.BookedSeatResponse;
import com.project.MovieTicketManagementPro.dto.response.BookingResponse;
import com.project.MovieTicketManagementPro.dto.response.BookingSummaryResponse;
import com.project.MovieTicketManagementPro.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BookingMapper {

    private final PaymentMapper paymentMapper;

    public BookingMapper(PaymentMapper paymentMapper) {
        this.paymentMapper = paymentMapper;
    }

    public BookingResponse toResponse(Booking booking) {
        Showtime showtime = booking.getShowtime();
        Screen screen = showtime.getScreen();
        Theater theater = screen.getTheater();
        Movie movie = showtime.getMovie();

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingRef(booking.getBookingRef())
                .status(booking.getStatus().name())
                .totalSeats(booking.getTotalSeats())
                .subtotal(booking.getSubtotal())
                .convenienceFee(booking.getConvenienceFee())
                .totalAmount(booking.getTotalAmount())
                .bookedAt(booking.getBookedAt())
                .expiresAt(booking.getExpiresAt())
                .showtimeId(showtime.getId())
                .movieTitle(movie.getTitle())
                .moviePoster(movie.getPosterUrl())
                .theaterName(theater.getName())
                .theaterAddress(theater.getAddress())
                .screenName(screen.getScreenName())
                .showDate(showtime.getShowDate())
                .showTime(showtime.getStartTime())
                .language(showtime.getLanguage().getName())
                .seats(booking.getBookingSeats() != null
                        ? booking.getBookingSeats().stream()
                          .map(this::toBookedSeatResponse)
                          .collect(Collectors.toList())
                        : List.of())
                .payment(booking.getPayment() != null
                        ? paymentMapper.toSummaryResponse(booking.getPayment())
                        : null)
                .build();
    }

    public BookingSummaryResponse toSummaryResponse(Booking booking) {
        Showtime showtime = booking.getShowtime();
        Screen screen = showtime.getScreen();
        Theater theater = screen.getTheater();
        Movie movie = showtime.getMovie();

        return BookingSummaryResponse.builder()
                .id(booking.getId())
                .bookingRef(booking.getBookingRef())
                .movieTitle(movie.getTitle())
                .moviePoster(movie.getPosterUrl())
                .theaterName(theater.getName())
                .showDate(showtime.getShowDate())
                .showTime(showtime.getStartTime())
                .totalSeats(booking.getTotalSeats())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus().name())
                .bookedAt(booking.getBookedAt())
                .build();
    }

    public BookedSeatResponse toBookedSeatResponse(BookingSeat bookingSeat) {
        Seat seat = bookingSeat.getShowtimeSeat().getSeat();
        return BookedSeatResponse.builder()
                .bookingSeatId(bookingSeat.getId())
                .rowLabel(seat.getRowLabel())
                .seatNumber(seat.getSeatNumber())
                .category(seat.getCategory().name())
                .priceAtBooking(bookingSeat.getPriceAtBooking())
                .build();
    }
}
