package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.ScreenType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeSearchRequest {

    @NotNull(message = "Movie ID is required")
    private Long movieId;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Show date is required")
    private LocalDate showDate;

    private Long languageId;

    private ScreenType screenType;
}
