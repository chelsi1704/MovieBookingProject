package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.Certificate;
import com.project.MovieTicketManagementPro.model.MovieStatus;
import jakarta.validation.constraints.*;
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
public class CreateMovieRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 600, message = "Duration cannot exceed 600 minutes")
    private Integer durationMins;

    @NotNull(message = "Release date is required")
    private LocalDate releaseDate;

    private String posterUrl;

    private String trailerUrl;

    @NotNull(message = "Movie status is required")
    private MovieStatus status;

    @NotNull(message = "Certificate is required")
    private Certificate certificate;

    @NotEmpty(message = "At least one genre is required")
    private List<Long> genreIds;

    @NotEmpty(message = "At least one language is required")
    private List<Long> languageIds;

    private List<MovieCastRequest> cast;
}
