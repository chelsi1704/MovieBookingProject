package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface TheaterService {

    ApiResponse<TheaterDetailResponse> createTheater(
            CreateTheaterRequest request);

    ApiResponse<TheaterDetailResponse> updateTheater(
            Long id, UpdateTheaterRequest request);

    ApiResponse<String> deactivateTheater(Long id);

    ApiResponse<TheaterDetailResponse> getTheaterById(Long id);

    ApiResponse<List<TheaterSummaryResponse>> getTheatersByCity(
            String city);

    ApiResponse<List<TheaterSummaryResponse>> getNearbyTheaters(
            NearbyTheaterRequest request);


    ApiResponse<List<TheaterSummaryResponse>> getTheatersShowingMovie(
            Long movieId, String city, LocalDate date);

    ApiResponse<ScreenResponse> addScreen(Long theaterId,
                                          CreateScreenRequest request);

    ApiResponse<String> deactivateScreen(Long screenId);

    ApiResponse<SeatPriceRuleResponse> setSeatPriceRule(
            Long theaterId, CreateSeatPriceRuleRequest request);

    ApiResponse<List<SeatPriceRuleResponse>> getPriceRules(Long theaterId);

    ApiResponse<PageResponse<TheaterSummaryResponse>> getAllTheaters(
            Pageable pageable);
}
