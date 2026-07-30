package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSummaryResponse {

    private Long id;
    private String bookingRef;
    private String movieTitle;
    private String moviePoster;
    private String theaterName;
    private LocalDate showDate;
    private LocalTime showTime;
    private Integer totalSeats;
    private Double totalAmount;
    private String status;
    private LocalDateTime bookedAt;
}
