package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.ScreenType;
import com.project.MovieTicketManagementPro.model.SeatCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSeatPriceRuleRequest {

    @NotNull
    private SeatCategory seatCategory;

    @NotNull
    private ScreenType screenType;

    @NotNull
    @DecimalMin(value = "1.0", message = "Price must be greater than 0")
    private Double basePrice;
}
