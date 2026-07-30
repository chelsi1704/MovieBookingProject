package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MovieMapper {

    public MovieSummaryResponse toSummaryResponse(Movie movie) {
        return MovieSummaryResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .posterUrl(movie.getPosterUrl())
                .durationMins(movie.getDurationMins())
                .releaseDate(movie.getReleaseDate())
                .certificate(movie.getCertificate() != null
                        ? movie.getCertificate().name() : null)
                .status(movie.getStatus() != null
                        ? movie.getStatus().name() : null)
                .avgRating(movie.getAvgRating())
                .totalReviews(movie.getTotalReviews())

                .genres(movie.getGenres() != null
                        ? movie.getGenres().stream()
                          .map(Genre::getName)
                          .collect(Collectors.toList())
                        : List.of())

                .languages(movie.getLanguages() != null
                        ? movie.getLanguages().stream()
                          .map(Language::getName)
                          .collect(Collectors.toList())
                        : List.of())
                .build();
    }

    public MovieDetailResponse toDetailResponse(Movie movie) {
        return MovieDetailResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .durationMins(movie.getDurationMins())
                .releaseDate(movie.getReleaseDate())
                .certificate(movie.getCertificate() != null
                        ? movie.getCertificate().name() : null)
                .status(movie.getStatus() != null
                        ? movie.getStatus().name() : null)
                .avgRating(movie.getAvgRating())
                .totalReviews(movie.getTotalReviews())
                .genres(movie.getGenres() != null
                        ? movie.getGenres().stream()
                          .map(Genre::getName).collect(Collectors.toList())
                        : List.of())
                .languages(movie.getLanguages() != null
                        ? movie.getLanguages().stream()
                          .map(Language::getName).collect(Collectors.toList())
                        : List.of())

                .cast(movie.getCast() != null
                        ? movie.getCast().stream()
                          .map(this::toCastResponse)
                          .collect(Collectors.toList())
                        : List.of())

                .images(movie.getImages() != null
                        ? movie.getImages().stream()
                          .map(this::toImageResponse)
                          .collect(Collectors.toList())
                        : List.of())
                .createdAt(movie.getCreatedAt())
                .build();
    }

    public MovieCastResponse toCastResponse(MovieCast cast) {
        return MovieCastResponse.builder()
                .personId(cast.getPerson().getId())
                .personName(cast.getPerson().getName())
                .photoUrl(cast.getPerson().getPhotoUrl())
                .roleType(cast.getRoleType().name())
                .characterName(cast.getCharacterName())
                .billingOrder(cast.getBillingOrder())
                .build();
    }

    public MovieImageResponse toImageResponse(MovieImage image) {
        return MovieImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .type(image.getType() != null ? image.getType().name() : null)
                .build();
    }

    public GenreResponse toGenreResponse(Genre genre) {
        return GenreResponse.builder()
                .id(genre.getId())
                .name(genre.getName())
                .build();
    }

    public LanguageResponse toLanguageResponse(Language language) {
        return LanguageResponse.builder()
                .id(language.getId())
                .name(language.getName())
                .code(language.getCode())
                .build();
    }

    public PersonResponse toPersonResponse(Person person) {
        return PersonResponse.builder()
                .id(person.getId())
                .name(person.getName())
                .bio(person.getBio())
                .photoUrl(person.getPhotoUrl())
                .birthDate(person.getBirthDate())
                .nationality(person.getNationality())
                .build();
    }
}
