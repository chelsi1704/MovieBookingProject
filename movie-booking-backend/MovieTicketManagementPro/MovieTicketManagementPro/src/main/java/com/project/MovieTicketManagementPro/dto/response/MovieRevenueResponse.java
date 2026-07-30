package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieRevenueResponse {

    private Long movieId;
    private String movieTitle;
    private String posterUrl;
    private Long totalBookings;
    private Double totalRevenue;
}
