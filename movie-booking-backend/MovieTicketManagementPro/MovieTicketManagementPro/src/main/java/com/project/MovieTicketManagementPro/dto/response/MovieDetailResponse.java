package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDetailResponse {

    private Long id;
    private String title;
    private String description;
    private String posterUrl;
    private String trailerUrl;
    private Integer durationMins;
    private LocalDate releaseDate;
    private String certificate;
    private String status;
    private Double avgRating;
    private Integer totalReviews;
    private List<String> genres;
    private List<String> languages;
    private List<MovieCastResponse> cast;
    private List<MovieImageResponse> images;
    private LocalDateTime createdAt;
}
