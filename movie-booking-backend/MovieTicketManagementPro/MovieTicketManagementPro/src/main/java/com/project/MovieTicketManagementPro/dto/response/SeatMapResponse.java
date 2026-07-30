package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatMapResponse {

    private Long showtimeId;
    private String movieTitle;
    private LocalDate showDate;
    private LocalTime startTime;
    private String screenName;
    private String screenType;

    private Map<String, List<SeatStatusResponse>> seatsByRow;

    private Integer totalSeats;
    private Integer availableSeats;
    private Integer lockedSeats;
    private Integer bookedSeats;
}
