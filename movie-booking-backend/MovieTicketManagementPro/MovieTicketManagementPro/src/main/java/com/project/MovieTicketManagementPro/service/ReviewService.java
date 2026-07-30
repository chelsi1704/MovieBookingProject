package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import java.util.List;

public interface ReviewService {

    ApiResponse<ReviewResponse> createReview(
            CreateReviewRequest request);

    ApiResponse<List<ReviewResponse>> getReviewsByMovie(
            Long movieId);

    ApiResponse<RatingDistributionResponse> getRatingDistribution(
            Long movieId);

    ApiResponse<String> approveReview(Long reviewId);

    ApiResponse<String> deleteReview(Long reviewId);
}