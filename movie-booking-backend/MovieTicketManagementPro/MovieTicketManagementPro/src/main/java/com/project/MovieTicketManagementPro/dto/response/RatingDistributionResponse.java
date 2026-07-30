package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingDistributionResponse {

    private Double averageRating;
    private Integer totalReviews;

    private Map<Integer, Long> distribution;

    // Percentage for the rating bar UI — key = star, value = 0.0–100.0
    private Map<Integer, Double> percentages;
}
