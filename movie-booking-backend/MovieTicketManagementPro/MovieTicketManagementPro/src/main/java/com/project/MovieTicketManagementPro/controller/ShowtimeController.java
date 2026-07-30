package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.request.CreateShowtimeRequest;
import com.project.MovieTicketManagementPro.dto.request.ShowtimeSearchRequest;
import com.project.MovieTicketManagementPro.dto.response.ApiResponse;
import com.project.MovieTicketManagementPro.dto.response.SeatMapResponse;
import com.project.MovieTicketManagementPro.dto.response.ShowtimeResponse;
import com.project.MovieTicketManagementPro.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
@Tag(name = "Showtimes",
        description = "Search showtimes, view seat maps, manage schedules")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    @PostMapping("/search")
    @Operation(
            summary = "Search showtimes",
            description = "Find all showtimes for a movie in a city on a date. " +
                    "Optional filters: languageId, screenType."
    )
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>>
    searchShowtimes(
            @Valid @RequestBody ShowtimeSearchRequest request) {

        return ResponseEntity.ok(
                showtimeService.searchShowtimes(request));
    }

    @GetMapping("/theater/{theaterId}")
    @Operation(
            summary = "Get showtimes by theater and date",
            description = "Returns all scheduled showtimes for a theater on a date."
    )
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>>
    getByTheaterAndDate(
            @PathVariable Long theaterId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return ResponseEntity.ok(
                showtimeService.getShowtimesByTheaterAndDate(
                        theaterId, date));
    }

    @GetMapping("/available-dates")
    @Operation(
            summary = "Get available booking dates",
            description = "Returns all dates that have at least one scheduled " +
                    "showtime for the given movie in the given city. " +
                    "Use to highlight bookable dates on the calendar."
    )
    public ResponseEntity<ApiResponse<List<LocalDate>>>
    getAvailableDates(
            @RequestParam Long movieId,
            @RequestParam String city) {

        return ResponseEntity.ok(
                showtimeService.getAvailableDates(movieId, city));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get showtime by ID")
    public ResponseEntity<ApiResponse<ShowtimeResponse>>
    getShowtimeById(@PathVariable Long id) {

        return ResponseEntity.ok(
                showtimeService.getShowtimeById(id));
    }

    @GetMapping("/{id}/seat-map")
    @Operation(
            summary = "Get seat map for a showtime",
            description = "Returns all seats with status (AVAILABLE/LOCKED/BOOKED) " +
                    "grouped by row. Authenticated users see their locked seats " +
                    "highlighted. Refresh this endpoint to get live availability."
    )
    public ResponseEntity<ApiResponse<SeatMapResponse>>
    getSeatMap(@PathVariable Long id) {

        return ResponseEntity.ok(
                showtimeService.getSeatMap(id));
    }

    @GetMapping("/screen/{screenId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'THEATER_OWNER')")
    @Operation(
            summary = "Get showtimes for a screen — ADMIN / THEATER_OWNER",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>>
    getByScreen(@PathVariable Long screenId) {

        return ResponseEntity.ok(
                showtimeService.getShowtimesByScreen(screenId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'THEATER_OWNER')")
    @Operation(
            summary = "Create showtime — ADMIN / THEATER_OWNER",
            description = "Schedules a new movie screening. " +
                    "Automatically generates ShowtimeSeat records for every seat. " +
                    "End time is auto-calculated from movie duration if not provided.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Showtime created and seats generated"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Conflicting showtime in same screen at same time"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Screen has no seats configured"
            )
    })
    public ResponseEntity<ApiResponse<ShowtimeResponse>> createShowtime(
            @Valid @RequestBody CreateShowtimeRequest request) {

        ApiResponse<ShowtimeResponse> response =
                showtimeService.createShowtime(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'THEATER_OWNER')")
    @Operation(
            summary = "Update showtime — ADMIN / THEATER_OWNER",
            description = "Updates time/language. Blocked if any seats are already booked.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<ApiResponse<ShowtimeResponse>> updateShowtime(
            @PathVariable Long id,
            @Valid @RequestBody CreateShowtimeRequest request) {

        return ResponseEntity.ok(
                showtimeService.updateShowtime(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'THEATER_OWNER')")
    @Operation(
            summary = "Cancel showtime — ADMIN / THEATER_OWNER",
            description = "Cancels a scheduled showtime. Releases all seat locks. " +
                    "Booked seats go through the refund flow separately.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<ApiResponse<String>> cancelShowtime(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                showtimeService.cancelShowtime(id));
    }
}