package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.WishlistResponse;
import com.project.MovieTicketManagementPro.model.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {

    private final MovieMapper movieMapper;

    public WishlistMapper(MovieMapper movieMapper) {
        this.movieMapper = movieMapper;
    }

    public WishlistResponse toResponse(Wishlist wishlist) {
        return WishlistResponse.builder()
                .id(wishlist.getId())
                .addedAt(wishlist.getAddedAt())
                .movie(movieMapper.toSummaryResponse(wishlist.getMovie()))
                .build();
    }
}
