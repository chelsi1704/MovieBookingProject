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
public class ShowtimeResponse {

    private Long id;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private Integer availableSeats;
    private Integer totalSeats;

    private Long movieId;
    private String movieTitle;
    private String moviePoster;

    private Long theaterId;
    private String theaterName;
    private String theaterAddress;
    private Long screenId;
    private String screenName;
    private String screenType;

    private String language;

    private Double minPrice;
    private Double maxPrice;
}
