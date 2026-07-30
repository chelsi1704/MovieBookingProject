package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.mapper.WishlistMapper;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.service.WishlistService;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final MovieRepository movieRepository;
    private final WishlistMapper wishlistMapper;
    private final SecurityUtil securityUtil;

    @Override
    public ApiResponse<String> addToWishlist(Long movieId) {
        User user = securityUtil.getCurrentUser();

        if (wishlistRepository.existsByUserIdAndMovieId(
                user.getId(), movieId)) {
            return ApiResponse.success(
                    "Movie already in wishlist.", null);
        }

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(movieId));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .movie(movie)
                .build();

        wishlistRepository.save(wishlist);
        return ApiResponse.success(
                "Movie added to wishlist.", null);
    }

    @Override
    public ApiResponse<String> removeFromWishlist(Long movieId) {
        Long userId = securityUtil.getCurrentUserId();
        wishlistRepository.deleteByUserIdAndMovieId(userId, movieId);
        return ApiResponse.success(
                "Movie removed from wishlist.", null);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<WishlistResponse>> getMyWishlist() {
        Long userId = securityUtil.getCurrentUserId();
        List<WishlistResponse> items =
                wishlistRepository
                        .findByUserIdOrderByAddedAtDesc(userId)
                        .stream()
                        .map(wishlistMapper::toResponse)
                        .collect(Collectors.toList());
        return ApiResponse.success("Wishlist fetched.", items);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Boolean> isWishlisted(Long movieId) {
        Long userId = securityUtil.getCurrentUserId();
        boolean wishlisted = wishlistRepository
                .existsByUserIdAndMovieId(userId, movieId);
        return ApiResponse.success("Checked.", wishlisted);
    }
}