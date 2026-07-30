package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyOfferResponse {

    private String offerCode;
    private String description;
    private Double originalAmount;
    private Double discountAmount;
    private Double finalAmount;
    private String message;
}
