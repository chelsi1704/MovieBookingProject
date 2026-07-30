package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{movieId}")
    public ResponseEntity<ApiResponse<String>> add(
            @PathVariable Long movieId) {
        return ResponseEntity.ok(
                wishlistService.addToWishlist(movieId));
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<ApiResponse<String>> remove(
            @PathVariable Long movieId) {
        return ResponseEntity.ok(
                wishlistService.removeFromWishlist(movieId));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistResponse>>>
    getMyWishlist() {
        return ResponseEntity.ok(
                wishlistService.getMyWishlist());
    }

    @GetMapping("/{movieId}/check")
    public ResponseEntity<ApiResponse<Boolean>> isWishlisted(
            @PathVariable Long movieId) {
        return ResponseEntity.ok(
                wishlistService.isWishlisted(movieId));
    }
}
