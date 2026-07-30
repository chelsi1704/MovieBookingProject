package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.response.*;
import java.util.List;

public interface WishlistService {
    ApiResponse<String> addToWishlist(Long movieId);
    ApiResponse<String> removeFromWishlist(Long movieId);
    ApiResponse<List<WishlistResponse>> getMyWishlist();
    ApiResponse<Boolean> isWishlisted(Long movieId);
}

