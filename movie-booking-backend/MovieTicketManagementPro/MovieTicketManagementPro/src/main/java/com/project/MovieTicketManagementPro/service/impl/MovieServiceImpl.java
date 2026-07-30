package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.DuplicateResourceException;
import com.project.MovieTicketManagementPro.exception.MovieNotFoundException;
import com.project.MovieTicketManagementPro.exception.ResourceNotFoundException;
import com.project.MovieTicketManagementPro.mapper.MovieMapper;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final LanguageRepository languageRepository;
    private final PersonRepository personRepository;
    private final MovieCastRepository movieCastRepository;
    private final MovieImageRepository movieImageRepository;
    private final MovieMapper movieMapper;

    @Override
    public ApiResponse<MovieDetailResponse> createMovie(
            CreateMovieRequest request) {

        if (movieRepository.existsByTitleAndReleaseDate(
                request.getTitle(), request.getReleaseDate())) {
            throw new DuplicateResourceException(
                    "Movie", "title and release date",
                    request.getTitle() + " (" + request.getReleaseDate() + ")");
        }

        List<Genre> genres = loadGenres(request.getGenreIds());

        List<Language> languages = loadLanguages(request.getLanguageIds());

        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .durationMins(request.getDurationMins())
                .releaseDate(request.getReleaseDate())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .status(request.getStatus())
                .certificate(request.getCertificate())
                .genres(genres)
                .languages(languages)
                .avgRating(0.0)
                .totalReviews(0)
                .build();

        Movie savedMovie = movieRepository.save(movie);

        if (request.getCast() != null && !request.getCast().isEmpty()) {
            saveCast(savedMovie, request.getCast());
        }

        log.info("Movie created: {} (id={})",
                savedMovie.getTitle(), savedMovie.getId());

        Movie fullMovie = loadMovieWithAssociations(savedMovie.getId());
        return ApiResponse.success(
                "Movie created successfully.",
                movieMapper.toDetailResponse(fullMovie)
        );
    }

    @Override
    public ApiResponse<MovieDetailResponse> updateMovie(
            Long id, UpdateMovieRequest request) {

        Movie movie = loadMovieOrThrow(id);

        if (request.getTitle() != null) movie.setTitle(request.getTitle());
        if (request.getDescription() != null)
            movie.setDescription(request.getDescription());
        if (request.getDurationMins() != null)
            movie.setDurationMins(request.getDurationMins());
        if (request.getReleaseDate() != null)
            movie.setReleaseDate(request.getReleaseDate());
        if (request.getPosterUrl() != null)
            movie.setPosterUrl(request.getPosterUrl());
        if (request.getTrailerUrl() != null)
            movie.setTrailerUrl(request.getTrailerUrl());
        if (request.getStatus() != null) movie.setStatus(request.getStatus());
        if (request.getCertificate() != null)
            movie.setCertificate(request.getCertificate());

        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()) {
            movie.setGenres(loadGenres(request.getGenreIds()));
        }

        if (request.getLanguageIds() != null
                && !request.getLanguageIds().isEmpty()) {
            movie.setLanguages(loadLanguages(request.getLanguageIds()));
        }

        movieRepository.save(movie);

        if (request.getCast() != null && !request.getCast().isEmpty()) {

            movieCastRepository.deleteByMovieId(id);
            saveCast(movie, request.getCast());
        }

        log.info("Movie updated: {} (id={})", movie.getTitle(), id);

        Movie updated = loadMovieWithAssociations(id);
        return ApiResponse.success(
                "Movie updated successfully.",
                movieMapper.toDetailResponse(updated)
        );
    }

    @Override
    public ApiResponse<String> deleteMovie(Long id) {
        Movie movie = loadMovieOrThrow(id);
        movie.setStatus(MovieStatus.ENDED);
        movieRepository.save(movie);
        log.info("Movie soft-deleted (set to ENDED): {} (id={})",
                movie.getTitle(), id);
        return ApiResponse.success(
                "Movie removed from listings successfully.", null
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<MovieDetailResponse> getMovieById(Long id) {
        Movie movie = loadMovieWithAssociations(id);
        return ApiResponse.success(
                "Movie fetched successfully.",
                movieMapper.toDetailResponse(movie)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<MovieSummaryResponse>> getAllMovies(
            MovieStatus status, Pageable pageable) {

        Page<Movie> page;
        if (status != null) {
            page = movieRepository.findAll(
                    pageable
            );
        } else {
            page = movieRepository.findAll(pageable);
        }

        return ApiResponse.success(
                "Movies fetched successfully.",
                buildPageResponse(page)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<MovieSummaryResponse>> searchMovies(
            String title, Long genreId, Long languageId,
            MovieStatus status, Pageable pageable) {

        Page<Movie> page = movieRepository.searchMovies(
                title, genreId, languageId, status, pageable
        );

        return ApiResponse.success(
                "Search results fetched.",
                buildPageResponse(page)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<MovieSummaryResponse>> getNowPlayingMovies() {
        List<Movie> movies = movieRepository
                .findByStatusOrderByAvgRatingDesc(MovieStatus.NOW_PLAYING);
        return ApiResponse.success(
                "Now playing movies fetched.",
                movies.stream()
                        .map(movieMapper::toSummaryResponse)
                        .collect(Collectors.toList())
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<MovieSummaryResponse>> getUpcomingMovies() {
        List<Movie> movies = movieRepository
                .findByStatusOrderByReleaseDateAsc(MovieStatus.UPCOMING);
        return ApiResponse.success(
                "Upcoming movies fetched.",
                movies.stream()
                        .map(movieMapper::toSummaryResponse)
                        .collect(Collectors.toList())
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<MovieSummaryResponse>> getTopRatedMovies() {
        List<Movie> movies = movieRepository
                .findByStatusOrderByAvgRatingDesc(MovieStatus.NOW_PLAYING);
        return ApiResponse.success(
                "Top rated movies fetched.",
                movies.stream()
                        .map(movieMapper::toSummaryResponse)
                        .collect(Collectors.toList())
        );
    }

    @Override
    public ApiResponse<GenreResponse> createGenre(
            CreateGenreRequest request) {

        if (genreRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException(
                    "Genre", "name", request.getName());
        }

        Genre genre = Genre.builder()
                .name(request.getName())
                .build();

        Genre saved = genreRepository.save(genre);
        log.info("Genre created: {}", saved.getName());

        return ApiResponse.success(
                "Genre created successfully.",
                movieMapper.toGenreResponse(saved)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<GenreResponse>> getAllGenres() {
        List<GenreResponse> genres = genreRepository.findAll()
                .stream()
                .map(movieMapper::toGenreResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Genres fetched.", genres);
    }

    @Override
    public ApiResponse<LanguageResponse> createLanguage(
            CreateLanguageRequest request) {

        if (languageRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException(
                    "Language", "name", request.getName());
        }

        Language language = Language.builder()
                .name(request.getName())
                .code(request.getCode())
                .build();

        Language saved = languageRepository.save(language);
        log.info("Language created: {}", saved.getName());

        return ApiResponse.success(
                "Language created successfully.",
                movieMapper.toLanguageResponse(saved)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<LanguageResponse>> getAllLanguages() {
        List<LanguageResponse> languages = languageRepository.findAll()
                .stream()
                .map(movieMapper::toLanguageResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Languages fetched.", languages);
    }

    @Override
    public ApiResponse<PersonResponse> createPerson(
            CreatePersonRequest request) {

        if (personRepository.existsByNameAndBirthDate(
                request.getName(), request.getBirthDate())) {
            throw new DuplicateResourceException(
                    "Person", "name and birthDate",
                    request.getName());
        }

        Person person = Person.builder()
                .name(request.getName())
                .bio(request.getBio())
                .photoUrl(request.getPhotoUrl())
                .birthDate(request.getBirthDate())
                .nationality(request.getNationality())
                .build();

        Person saved = personRepository.save(person);
        log.info("Person created: {}", saved.getName());

        return ApiResponse.success(
                "Person created successfully.",
                movieMapper.toPersonResponse(saved)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PersonResponse> getPersonById(Long id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Person", "id", id));
        return ApiResponse.success(
                "Person fetched successfully.",
                movieMapper.toPersonResponse(person)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<PersonResponse>> searchPersons(String name) {
        List<PersonResponse> persons =
                personRepository.findByNameContainingIgnoreCase(name)
                        .stream()
                        .map(movieMapper::toPersonResponse)
                        .collect(Collectors.toList());
        return ApiResponse.success("Persons fetched.", persons);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<DashboardStatsResponse> getMovieStats() {
        List<Object[]> statusCounts = movieRepository.countMoviesByStatus();

        long nowPlaying = 0, upcoming = 0, ended = 0;
        for (Object[] row : statusCounts) {
            MovieStatus status = (MovieStatus) row[0];
            Long count = (Long) row[1];
            if (status == MovieStatus.NOW_PLAYING) nowPlaying = count;
            else if (status == MovieStatus.UPCOMING) upcoming = count;
            else ended = count;
        }

        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalMovies(nowPlaying + upcoming + ended)
                .moviesNowPlaying(nowPlaying)
                .moviesUpcoming(upcoming)
                .build();

        return ApiResponse.success("Movie stats fetched.", stats);
    }

    private Movie loadMovieOrThrow(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    private Movie loadMovieWithAssociations(Long id) {
        Movie movie = loadMovieOrThrow(id);
        if (movie.getGenres() != null) movie.getGenres().size();
        if (movie.getLanguages() != null) movie.getLanguages().size();
        if (movie.getCast() != null) movie.getCast().size();
        if (movie.getImages() != null) movie.getImages().size();
        return movie;
    }

    private List<Genre> loadGenres(List<Long> genreIds) {
        List<Genre> genres = genreRepository.findByIdIn(genreIds);
        if (genres.size() != genreIds.size()) {
            throw new ResourceNotFoundException(
                    "One or more genre IDs are invalid");
        }
        return genres;
    }

    private List<Language> loadLanguages(List<Long> languageIds) {
        List<Language> languages = languageRepository.findByIdIn(languageIds);
        if (languages.size() != languageIds.size()) {
            throw new ResourceNotFoundException(
                    "One or more language IDs are invalid");
        }
        return languages;
    }

    private void saveCast(Movie movie, List<MovieCastRequest> castRequests) {
        List<MovieCast> castList = new ArrayList<>();
        for (int i = 0; i < castRequests.size(); i++) {
            MovieCastRequest cr = castRequests.get(i);
            Person person = personRepository.findById(cr.getPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Person", "id", cr.getPersonId()));

            MovieCast cast = MovieCast.builder()
                    .movie(movie)
                    .person(person)
                    .roleType(cr.getRoleType())
                    .characterName(cr.getCharacterName())
                    .billingOrder(cr.getBillingOrder() != null
                            ? cr.getBillingOrder() : i + 1)
                    .build();
            castList.add(cast);
        }
        movieCastRepository.saveAll(castList);
    }

    private PageResponse<MovieSummaryResponse> buildPageResponse(
            Page<Movie> page) {
        return PageResponse.<MovieSummaryResponse>builder()
                .content(page.getContent().stream()
                        .map(movieMapper::toSummaryResponse)
                        .collect(Collectors.toList()))
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }
}
