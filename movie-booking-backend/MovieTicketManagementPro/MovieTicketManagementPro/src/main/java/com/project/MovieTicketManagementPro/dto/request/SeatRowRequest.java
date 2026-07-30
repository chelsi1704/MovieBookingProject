package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.SeatCategory;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatRowRequest {

    @NotBlank(message = "Row label is required")
    @Size(min = 1, max = 2)
    private String rowLabel;

    @NotNull
    @Min(1) @Max(50)
    private Integer numberOfSeats;

    @NotNull(message = "Category is required")
    private SeatCategory category;
}
