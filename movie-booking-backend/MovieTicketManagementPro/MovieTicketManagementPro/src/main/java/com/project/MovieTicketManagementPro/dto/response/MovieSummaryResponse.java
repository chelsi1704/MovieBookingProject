package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieSummaryResponse {

    private Long id;
    private String title;
    private String posterUrl;
    private Integer durationMins;
    private LocalDate releaseDate;
    private String certificate;
    private String status;
    private Double avgRating;
    private Integer totalReviews;
    private List<String> genres;
    private List<String> languages;
}
