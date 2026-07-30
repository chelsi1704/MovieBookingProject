package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatPriceRuleResponse {

    private Long id;
    private String seatCategory;
    private String screenType;
    private Double basePrice;
}
