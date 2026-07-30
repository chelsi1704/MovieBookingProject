package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.CreateShowtimeRequest;
import com.project.MovieTicketManagementPro.dto.request.ShowtimeSearchRequest;
import com.project.MovieTicketManagementPro.dto.response.ApiResponse;
import com.project.MovieTicketManagementPro.dto.response.SeatMapResponse;
import com.project.MovieTicketManagementPro.dto.response.ShowtimeResponse;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeService {

    ApiResponse<ShowtimeResponse> createShowtime(CreateShowtimeRequest request);

    ApiResponse<ShowtimeResponse> updateShowtime(Long id,
                                                 CreateShowtimeRequest request);

    ApiResponse<String> cancelShowtime(Long id);

    ApiResponse<ShowtimeResponse> getShowtimeById(Long id);

    ApiResponse<List<ShowtimeResponse>> searchShowtimes(ShowtimeSearchRequest request);

    ApiResponse<List<ShowtimeResponse>> getShowtimesByTheaterAndDate(Long theaterId, LocalDate date);

    ApiResponse<List<LocalDate>> getAvailableDates(Long movieId, String city);

    ApiResponse<SeatMapResponse> getSeatMap(Long showtimeId);

    ApiResponse<List<ShowtimeResponse>> getShowtimesByScreen(Long screenId);

    void completePastShowtimes();

    void releaseExpiredSeatLocks();
}
