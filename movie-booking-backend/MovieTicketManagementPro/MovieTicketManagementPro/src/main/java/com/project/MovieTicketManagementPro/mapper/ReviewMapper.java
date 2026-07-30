package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.RatingDistributionResponse;
import com.project.MovieTicketManagementPro.dto.response.ReviewResponse;
import com.project.MovieTicketManagementPro.model.Review;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .isApproved(review.isApproved())
                .userName(review.getUser().getName())
                .userAvatar(review.getUser().getAvatarUrl())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public RatingDistributionResponse toDistributionResponse(
            Double avgRating,
            Integer totalReviews,
            List<Object[]> rawData) {

        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }

        rawData.forEach(row -> distribution.put((Integer) row[0], (Long) row[1]));

        Map<Integer, Double> percentages = new HashMap<>();
        distribution.forEach((star, count) -> {
            double pct = totalReviews > 0
                    ? (count * 100.0) / totalReviews : 0.0;
            percentages.put(star, Math.round(pct * 10.0) / 10.0); // 1 decimal
        });

        return RatingDistributionResponse.builder()
                .averageRating(avgRating)
                .totalReviews(totalReviews)
                .distribution(distribution)
                .percentages(percentages)
                .build();
    }
}
