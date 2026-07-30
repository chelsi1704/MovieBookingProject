package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(request));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>>
    getByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(
                reviewService.getReviewsByMovie(movieId));
    }

    @GetMapping("/movie/{movieId}/distribution")
    public ResponseEntity<ApiResponse<RatingDistributionResponse>>
    getDistribution(@PathVariable Long movieId) {
        return ResponseEntity.ok(
                reviewService.getRatingDistribution(movieId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> approve(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                reviewService.approveReview(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                reviewService.deleteReview(id));
    }
}