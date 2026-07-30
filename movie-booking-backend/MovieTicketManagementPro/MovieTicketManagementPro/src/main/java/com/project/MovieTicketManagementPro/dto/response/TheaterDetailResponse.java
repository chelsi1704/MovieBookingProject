package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheaterDetailResponse {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private Double latitude;
    private Double longitude;
    private boolean isActive;
    private List<String> amenities;
    private List<ScreenResponse> screens;
    private List<SeatPriceRuleResponse> priceRules;
    private LocalDateTime createdAt;
}
