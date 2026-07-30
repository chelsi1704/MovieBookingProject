package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.Repository.BookingRepository;
import com.project.MovieTicketManagementPro.Repository.ReviewRepository;
import com.project.MovieTicketManagementPro.dto.response.UserProfileResponse;
import com.project.MovieTicketManagementPro.dto.response.UserSummaryResponse;
import com.project.MovieTicketManagementPro.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public UserSummaryResponse toSummaryResponse(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .isVerified(user.isVerified())
                .build();
    }


    public UserProfileResponse toProfileResponse(User user) {
             int totalBookings = bookingRepository
                .findByUserIdOrderByBookedAtDesc(user.getId()).size();
        int totalReviews = reviewRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId()).size();

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .provider(user.getProvider().name())
                .isVerified(user.isVerified())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .totalBookings(totalBookings)
                .totalReviews(totalReviews)
                .build();
    }
}
