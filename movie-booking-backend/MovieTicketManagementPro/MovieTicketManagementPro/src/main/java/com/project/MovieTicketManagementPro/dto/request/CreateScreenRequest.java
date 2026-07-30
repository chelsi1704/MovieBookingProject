package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.ScreenType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateScreenRequest {

    @NotBlank(message = "Screen name is required")
    private String screenName;

    @NotNull(message = "Screen type is required")
    private ScreenType screenType;

    @NotNull(message = "Total seats is required")
    @Min(value = 10, message = "Screen must have at least 10 seats")
    @Max(value = 1000, message = "Screen cannot have more than 1000 seats")
    private Integer totalSeats;

    @NotEmpty(message = "Seat layout is required")
    private List<SeatRowRequest> seatLayout;
}
