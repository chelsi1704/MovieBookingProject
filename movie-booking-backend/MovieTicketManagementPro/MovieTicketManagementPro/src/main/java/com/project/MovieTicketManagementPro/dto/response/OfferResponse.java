package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferResponse {

    private Long id;
    private String code;
    private String description;
    private String type;
    private Double discountValue;
    private Double minOrderAmount;
    private Double maxDiscount;
    private Integer maxUses;
    private Integer usedCount;
    private Integer remainingUses;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private boolean isActive;
}
