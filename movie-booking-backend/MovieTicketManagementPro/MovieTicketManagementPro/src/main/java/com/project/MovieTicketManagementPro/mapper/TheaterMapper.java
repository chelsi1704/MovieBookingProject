package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.ScreenResponse;
import com.project.MovieTicketManagementPro.dto.response.SeatPriceRuleResponse;
import com.project.MovieTicketManagementPro.dto.response.TheaterDetailResponse;
import com.project.MovieTicketManagementPro.dto.response.TheaterSummaryResponse;
import com.project.MovieTicketManagementPro.model.Screen;
import com.project.MovieTicketManagementPro.model.SeatPriceRule;
import com.project.MovieTicketManagementPro.model.Theater;
import com.project.MovieTicketManagementPro.model.TheaterAmenity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TheaterMapper {

    public TheaterSummaryResponse toSummaryResponse(Theater theater,
                                                    Double distanceKm) {
        return TheaterSummaryResponse.builder()
                .id(theater.getId())
                .name(theater.getName())
                .address(theater.getAddress())
                .city(theater.getCity())
                .state(theater.getState())
                .pincode(theater.getPincode())
                .latitude(theater.getLatitude())
                .longitude(theater.getLongitude())
                .distanceKm(distanceKm != null
                        ? Math.round(distanceKm * 10.0) / 10.0 : null)
                .amenities(theater.getAmenities() != null
                        ? theater.getAmenities().stream()
                          .map(TheaterAmenity::getName)
                          .collect(Collectors.toList())
                        : List.of())
                .totalScreens(theater.getScreens() != null
                        ? theater.getScreens().size() : 0)
                .build();
    }

    public TheaterSummaryResponse toSummaryResponse(Theater theater) {
        return toSummaryResponse(theater, null);
    }


    public TheaterDetailResponse toDetailResponse(Theater theater) {
        return TheaterDetailResponse.builder()
                .id(theater.getId())
                .name(theater.getName())
                .address(theater.getAddress())
                .city(theater.getCity())
                .state(theater.getState())
                .pincode(theater.getPincode())
                .phone(theater.getPhone())
                .latitude(theater.getLatitude())
                .longitude(theater.getLongitude())
                .isActive(theater.isActive())
                .amenities(theater.getAmenities() != null
                        ? theater.getAmenities().stream()
                          .map(TheaterAmenity::getName)
                          .collect(Collectors.toList())
                        : List.of())

                .screens(theater.getScreens() != null
                        ? theater.getScreens().stream()
                          .filter(Screen::isActive)
                          .map(this::toScreenResponse)
                          .collect(Collectors.toList())
                        : List.of())

                .priceRules(theater.getPriceRules() != null
                        ? theater.getPriceRules().stream()
                          .map(this::toPriceRuleResponse)
                          .collect(Collectors.toList())
                        : List.of())
                .createdAt(theater.getCreatedAt())
                .build();
    }

    public ScreenResponse toScreenResponse(Screen screen) {
        return ScreenResponse.builder()
                .id(screen.getId())
                .screenName(screen.getScreenName())
                .screenType(screen.getScreenType().name())
                .totalSeats(screen.getTotalSeats())
                .isActive(screen.isActive())
                .build();
    }

    public SeatPriceRuleResponse toPriceRuleResponse(SeatPriceRule rule) {
        return SeatPriceRuleResponse.builder()
                .id(rule.getId())
                .seatCategory(rule.getSeatCategory().name())
                .screenType(rule.getScreenType().name())
                .basePrice(rule.getBasePrice())
                .build();
    }
}
