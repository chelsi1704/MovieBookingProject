package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.OfferType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOfferRequest {

    @NotBlank(message = "Offer code is required")
    @Size(min = 3, max = 20)
    @Pattern(regexp = "^[A-Z0-9]+$", message = "Code must be uppercase letters and numbers only")
    private String code;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Offer type is required")
    private OfferType type;

    @NotNull
    @DecimalMin("1.0")
    private Double discountValue;

    private Double minOrderAmount;
    private Double maxDiscount;

    private Integer maxUses;

    @NotNull
    private LocalDate validFrom;

    @NotNull
    private LocalDate validUntil;
}
