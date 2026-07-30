package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String avatarUrl;
    private String role;
    private String provider;
    private boolean isVerified;
    private boolean isActive;
    private LocalDateTime createdAt;
    private Integer totalBookings;
    private Integer totalReviews;
}
