package com.project.MovieTicketManagementPro.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyOfferRequest {

    @NotBlank(message = "Offer code is required")
    private String code;

    @NotNull
    @DecimalMin("1.0")
    private Double orderAmount;
}
