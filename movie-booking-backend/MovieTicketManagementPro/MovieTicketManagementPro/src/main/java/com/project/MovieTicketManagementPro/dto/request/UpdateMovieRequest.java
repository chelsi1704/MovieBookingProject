package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.Certificate;
import com.project.MovieTicketManagementPro.model.MovieStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
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
public class UpdateMovieRequest {

    @Size(max = 200)
    private String title;

    private String description;

    @Min(1) @Max(600)
    private Integer durationMins;

    private LocalDate releaseDate;
    private String posterUrl;
    private String trailerUrl;
    private MovieStatus status;
    private Certificate certificate;
    private List<Long> genreIds;
    private List<Long> languageIds;
    private List<MovieCastRequest> cast;
}
