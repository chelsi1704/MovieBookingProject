package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.service.TheaterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@RequiredArgsConstructor
@Tag(name = "Theaters",
        description = "Browse theaters, find nearby, manage screens and pricing")
public class TheaterController {

    private final TheaterService theaterService;

    @GetMapping
    @Operation(summary = "Get all theaters — paginated")
    public ResponseEntity<ApiResponse<PageResponse<TheaterSummaryResponse>>>
    getAllTheaters(
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {

        return ResponseEntity.ok(
                theaterService.getAllTheaters(pageable));
    }

    @GetMapping("/city")
    @Operation(summary = "Get theaters by city")
    public ResponseEntity<ApiResponse<List<TheaterSummaryResponse>>>
    getByCity(@RequestParam String city) {

        return ResponseEntity.ok(
                theaterService.getTheatersByCity(city));
    }

    @PostMapping("/nearby")
    @Operation(summary = "Find theaters near location",
            description = "Send latitude, longitude and optional radius " +
                    "(default 10 km). Returns theaters sorted nearest first.")
    public ResponseEntity<ApiResponse<List<TheaterSummaryResponse>>>
    getNearby(
            @Valid @RequestBody NearbyTheaterRequest request) {

        return ResponseEntity.ok(
                theaterService.getNearbyTheaters(request));
    }

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get theaters showing a specific movie",
            description = "Returns theaters in the given city " +
                    "where the movie is scheduled on the given date.")
    public ResponseEntity<ApiResponse<List<TheaterSummaryResponse>>>
    getTheatersShowingMovie(
            @PathVariable Long movieId,
            @RequestParam String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return ResponseEntity.ok(
                theaterService.getTheatersShowingMovie(movieId, city, date));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get theater detail by ID")
    public ResponseEntity<ApiResponse<TheaterDetailResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(theaterService.getTheaterById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create theater — ADMIN / THEATER_OWNER",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<TheaterDetailResponse>> createTheater(
            @Valid @RequestBody CreateTheaterRequest request) {

        ApiResponse<TheaterDetailResponse> response =
                theaterService.createTheater(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update theater — ADMIN / THEATER_OWNER",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<TheaterDetailResponse>> updateTheater(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTheaterRequest request) {

        return ResponseEntity.ok(
                theaterService.updateTheater(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate theater — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<String>> deactivateTheater(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                theaterService.deactivateTheater(id));
    }

    @PostMapping("/{theaterId}/screens")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add screen to theater — ADMIN / THEATER_OWNER",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<ScreenResponse>> addScreen(
            @PathVariable Long theaterId,
            @Valid @RequestBody CreateScreenRequest request) {

        ApiResponse<ScreenResponse> response =
                theaterService.addScreen(theaterId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @DeleteMapping("/screens/{screenId}")
    @Operation(summary = "Deactivate screen — ADMIN / THEATER_OWNER",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<String>> deactivateScreen(
            @PathVariable Long screenId) {
        return ResponseEntity.ok(
                theaterService.deactivateScreen(screenId));
    }

    @GetMapping("/{theaterId}/prices")
    @Operation(summary = "Get seat price rules for a theater")
    public ResponseEntity<ApiResponse<List<SeatPriceRuleResponse>>>
    getPriceRules(@PathVariable Long theaterId) {

        return ResponseEntity.ok(
                theaterService.getPriceRules(theaterId));
    }

    @PostMapping("/{theaterId}/prices")
    @Operation(summary = "Set seat price rule — ADMIN / THEATER_OWNER",
            description = "Set the base price for a seat category + " +
                    "screen type combination. Updates existing rule if found.",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<SeatPriceRuleResponse>> setPriceRule(
            @PathVariable Long theaterId,
            @Valid @RequestBody CreateSeatPriceRuleRequest request) {

        return ResponseEntity.ok(
                theaterService.setSeatPriceRule(theaterId, request));
    }
}
