package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {

    private Long id;
    private String ticketCode;
    private String qrUrl;
    private boolean isScanned;

    private String movieTitle;
    private String theaterName;
    private String theaterAddress;
    private String screenName;
    private LocalDate showDate;
    private LocalTime showTime;
    private String rowLabel;
    private Integer seatNumber;
    private String seatCategory;
    private Double amountPaid;

    private String bookingRef;
}
