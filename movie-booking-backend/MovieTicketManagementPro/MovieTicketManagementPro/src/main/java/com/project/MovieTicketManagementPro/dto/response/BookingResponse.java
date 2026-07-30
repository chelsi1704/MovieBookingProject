package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private String bookingRef;
    private String status;

    private Integer totalSeats;
    private Double subtotal;
    private Double convenienceFee;
    private Double totalAmount;

    private LocalDateTime bookedAt;
    private LocalDateTime expiresAt;

    private Long showtimeId;
    private String movieTitle;
    private String moviePoster;
    private String theaterName;
    private String theaterAddress;
    private String screenName;
    private LocalDate showDate;
    private LocalTime showTime;
    private String language;

    private List<BookedSeatResponse> seats;

    private PaymentSummaryResponse payment;
}
