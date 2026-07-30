package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.mapper.ReviewMapper;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.service.ReviewService;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final BookingRepository bookingRepository;
    private final ReviewMapper reviewMapper;
    private final SecurityUtil securityUtil;

    @Override
    public ApiResponse<ReviewResponse> createReview(
            CreateReviewRequest request) {

        User user = securityUtil.getCurrentUser();

        if (reviewRepository.existsByUserIdAndMovieId(
                user.getId(), request.getMovieId())) {
            throw new ReviewAlreadyExistsException();
        }

        if (!bookingRepository.hasUserWatchedMovie(
                user.getId(), request.getMovieId())) {
            throw new ReviewNotAllowedException();
        }

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new MovieNotFoundException(
                        request.getMovieId()));

        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException(
                        request.getBookingId()));

        Review review = Review.builder()
                .user(user)
                .movie(movie)
                .booking(booking)
                .rating(request.getRating())
                .comment(request.getComment())
                .isApproved(false) // admin must approve first
                .build();

        Review saved = reviewRepository.save(review);

        updateMovieRating(movie);

        return ApiResponse.success(
                "Review submitted! It will appear after approval.",
                reviewMapper.toResponse(saved));
    }
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<ReviewResponse>> getReviewsByMovie(
            Long movieId) {
        List<ReviewResponse> reviews = reviewRepository
                .findByMovieIdAndIsApprovedOrderByCreatedAtDesc(
                        movieId, true)
                .stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Reviews fetched.", reviews);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<RatingDistributionResponse>
    getRatingDistribution(Long movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(movieId));

        List<Object[]> rawData = reviewRepository
                .getRatingDistribution(movieId);

        return ApiResponse.success(
                "Rating distribution fetched.",
                reviewMapper.toDistributionResponse(
                        movie.getAvgRating(),
                        movie.getTotalReviews(),
                        rawData));
    }

    @Override
    public ApiResponse<String> approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Review", "id", reviewId));
        review.setApproved(true);
        reviewRepository.save(review);

        updateMovieRating(review.getMovie());

        return ApiResponse.success(
                "Review approved successfully.", null);
    }

    @Override
    public ApiResponse<String> deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Review", "id", reviewId));
        reviewRepository.delete(review);
        updateMovieRating(review.getMovie());
        return ApiResponse.success(
                "Review deleted successfully.", null);
    }

    private void updateMovieRating(Movie movie) {
        Double avg = reviewRepository
                .getAverageRatingForMovie(movie.getId());
        long count = reviewRepository
                .findByMovieIdAndIsApprovedOrderByCreatedAtDesc(
                        movie.getId(), true).size();
        movie.setAvgRating(avg != null
                ? Math.round(avg * 10.0) / 10.0 : 0.0);
        movie.setTotalReviews((int) count);
        movieRepository.save(movie);
    }
}