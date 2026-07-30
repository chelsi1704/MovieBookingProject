package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.model.MovieStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MovieService {

    ApiResponse<MovieDetailResponse> createMovie(CreateMovieRequest request);

    ApiResponse<MovieDetailResponse> updateMovie(Long id,
                                                 UpdateMovieRequest request);

    ApiResponse<String> deleteMovie(Long id);

    ApiResponse<MovieDetailResponse> getMovieById(Long id);

    ApiResponse<PageResponse<MovieSummaryResponse>> getAllMovies(
            MovieStatus status,
            Pageable pageable);

    ApiResponse<PageResponse<MovieSummaryResponse>> searchMovies(
            String title,
            Long genreId,
            Long languageId,
            MovieStatus status,
            Pageable pageable);

    ApiResponse<List<MovieSummaryResponse>> getNowPlayingMovies();

    ApiResponse<List<MovieSummaryResponse>> getUpcomingMovies();

    ApiResponse<List<MovieSummaryResponse>> getTopRatedMovies();

    ApiResponse<GenreResponse> createGenre(CreateGenreRequest request);
    ApiResponse<List<GenreResponse>> getAllGenres();

    ApiResponse<LanguageResponse> createLanguage(CreateLanguageRequest request);
    ApiResponse<List<LanguageResponse>> getAllLanguages();

    ApiResponse<PersonResponse> createPerson(CreatePersonRequest request);
    ApiResponse<PersonResponse> getPersonById(Long id);
    ApiResponse<List<PersonResponse>> searchPersons(String name);

    ApiResponse<DashboardStatsResponse> getMovieStats();
}
