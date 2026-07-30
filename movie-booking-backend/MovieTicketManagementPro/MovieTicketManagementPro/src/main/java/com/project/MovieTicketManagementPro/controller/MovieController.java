package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.model.MovieStatus;
import com.project.MovieTicketManagementPro.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Tag(name = "Movies",
        description = "Browse movies, search, filter, and admin CRUD")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    @Operation(summary = "Get all movies",
            description = "Returns paginated list. " +
                    "Filter by status: NOW_PLAYING, UPCOMING, ENDED.")
    public ResponseEntity<ApiResponse<PageResponse<MovieSummaryResponse>>>
    getAllMovies(
            @RequestParam(required = false) MovieStatus status,
            @PageableDefault(size = 12, sort = "releaseDate",
                    direction = Sort.Direction.DESC)
            Pageable pageable) {

        return ResponseEntity.ok(
                movieService.getAllMovies(status, pageable));
    }
   @GetMapping("/search")
    @Operation(summary = "Search movies",
            description = "Search by title, genre, language, status. " +
                    "All parameters optional.")
    public ResponseEntity<ApiResponse<PageResponse<MovieSummaryResponse>>>
    searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long genreId,
            @RequestParam(required = false) Long languageId,
            @RequestParam(required = false) MovieStatus status,
            @PageableDefault(size = 12) Pageable pageable) {

        return ResponseEntity.ok(
                movieService.searchMovies(
                        title, genreId, languageId, status, pageable));
    }

     @GetMapping("/now-playing")
    @Operation(summary = "Get now playing movies")
    public ResponseEntity<ApiResponse<List<MovieSummaryResponse>>>
    getNowPlaying() {
        return ResponseEntity.ok(movieService.getNowPlayingMovies());
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming movies")
    public ResponseEntity<ApiResponse<List<MovieSummaryResponse>>>
    getUpcoming() {
        return ResponseEntity.ok(movieService.getUpcomingMovies());
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated movies")
    public ResponseEntity<ApiResponse<List<MovieSummaryResponse>>>
    getTopRated() {
        return ResponseEntity.ok(movieService.getTopRatedMovies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID",
            description = "Returns full movie detail including cast and images.")
    public ResponseEntity<ApiResponse<MovieDetailResponse>> getMovieById(
            @PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new movie — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<MovieDetailResponse>> createMovie(
            @Valid @RequestBody CreateMovieRequest request) {
        ApiResponse<MovieDetailResponse> response =
                movieService.createMovie(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update movie — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<MovieDetailResponse>> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMovieRequest request) {
        return ResponseEntity.ok(movieService.updateMovie(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove movie from listings — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<String>> deleteMovie(
            @PathVariable Long id) {
        return ResponseEntity.ok(movieService.deleteMovie(id));
    }


    @GetMapping("/genres")
    @Operation(summary = "Get all genres")
    public ResponseEntity<ApiResponse<List<GenreResponse>>> getAllGenres() {
        return ResponseEntity.ok(movieService.getAllGenres());
    }

    @PostMapping("/genres")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create genre — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<GenreResponse>> createGenre(
            @Valid @RequestBody CreateGenreRequest request) {
        ApiResponse<GenreResponse> response =
                movieService.createGenre(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/languages")
    @Operation(summary = "Get all languages")
    public ResponseEntity<ApiResponse<List<LanguageResponse>>>
    getAllLanguages() {
        return ResponseEntity.ok(movieService.getAllLanguages());
    }

    @PostMapping("/languages")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create language — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<LanguageResponse>> createLanguage(
            @Valid @RequestBody CreateLanguageRequest request) {
        ApiResponse<LanguageResponse> response =
                movieService.createLanguage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/persons/{id}")
    @Operation(summary = "Get person by ID")
    public ResponseEntity<ApiResponse<PersonResponse>> getPersonById(
            @PathVariable Long id) {
        return ResponseEntity.ok(movieService.getPersonById(id));
    }

    @GetMapping("/persons/search")
    @Operation(summary = "Search persons by name — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<List<PersonResponse>>> searchPersons(
            @RequestParam String name) {
        return ResponseEntity.ok(movieService.searchPersons(name));
    }

    @PostMapping("/persons")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create person — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<PersonResponse>> createPerson(
            @Valid @RequestBody CreatePersonRequest request) {
        ApiResponse<PersonResponse> response =
                movieService.createPerson(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get movie stats — ADMIN only",
            security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(movieService.getMovieStats());
    }
}