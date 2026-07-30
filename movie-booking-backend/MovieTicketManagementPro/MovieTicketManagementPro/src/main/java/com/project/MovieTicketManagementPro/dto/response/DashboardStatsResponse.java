package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private Long totalUsers;
    private Long newUsersToday;

    private Long totalMovies;
    private Long moviesNowPlaying;
    private Long moviesUpcoming;

    private Long totalTheaters;
    private Long totalScreens;

    private Long totalBookings;
    private Long bookingsToday;
    private Long confirmedBookings;
    private Long cancelledBookings;

    private Double totalRevenue;
    private Double revenueToday;
    private Double revenueThisMonth;

    private List<MovieRevenueResponse> topMoviesByRevenue;
}
