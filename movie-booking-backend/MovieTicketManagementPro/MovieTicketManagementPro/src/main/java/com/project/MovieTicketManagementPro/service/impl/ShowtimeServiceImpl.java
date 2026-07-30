package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.request.CreateShowtimeRequest;
import com.project.MovieTicketManagementPro.dto.request.ShowtimeSearchRequest;
import com.project.MovieTicketManagementPro.dto.response.ApiResponse;
import com.project.MovieTicketManagementPro.dto.response.SeatMapResponse;
import com.project.MovieTicketManagementPro.dto.response.ShowtimeResponse;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.mapper.ShowtimeMapper;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import com.project.MovieTicketManagementPro.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final SeatPriceRuleRepository priceRuleRepository;
    private final LanguageRepository languageRepository;
    private final TheaterRepository theaterRepository;
    private final ShowtimeMapper showtimeMapper;
    private final SecurityUtil securityUtil;

    @Override
    public ApiResponse<ShowtimeResponse> createShowtime(CreateShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new MovieNotFoundException(
                        request.getMovieId()));

        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ScreenNotFoundException(
                        request.getScreenId()));

        Language language = languageRepository.findById(request.getLanguageId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Language", "id", request.getLanguageId()));

        if (!screen.getTheater().isActive()) {
            throw new IllegalArgumentException(
                    "Cannot schedule showtime in an inactive theater.");
        }

        checkOwnershipOrAdmin(screen.getTheater());

        LocalTime endTime = request.getEndTime() != null
                ? request.getEndTime()
                : request.getStartTime()
                  .plusMinutes(movie.getDurationMins())
                  .plusMinutes(15);

        boolean hasConflict = showtimeRepository.existsConflictingShowtime(
                screen.getId(),
                request.getShowDate(),
                request.getStartTime(),
                endTime
        );

        if (hasConflict) {
            throw new ShowtimeConflictException(
                    screen.getScreenName(),
                    request.getStartTime(),
                    endTime
            );
        }

        List<Seat> seats = seatRepository
                .findByScreenIdAndIsActive(screen.getId(), true);

        if (seats.isEmpty()) {
            throw new IllegalArgumentException(
                    "Screen has no active seats. " +
                            "Please add seats before scheduling a showtime.");
        }

        Showtime showtime = Showtime.builder()
                .movie(movie)
                .screen(screen)
                .language(language)
                .showDate(request.getShowDate())
                .startTime(request.getStartTime())
                .endTime(endTime)
                .status(ShowtimeStatus.SCHEDULED)
                .availableSeats(seats.size())
                .build();

        Showtime saved = showtimeRepository.save(showtime);

        generateShowtimeSeats(saved, seats, screen);

        log.info("Showtime created: {} on {} at {} (id={})",
                movie.getTitle(), request.getShowDate(),
                request.getStartTime(), saved.getId());

        return ApiResponse.success(
                "Showtime scheduled successfully.",
                buildShowtimeResponse(saved)
        );
    }
    @Override
    public ApiResponse<ShowtimeResponse> updateShowtime(Long id, CreateShowtimeRequest request) {

        Showtime showtime = loadShowtimeOrThrow(id);
        checkOwnershipOrAdmin(showtime.getScreen().getTheater());

        long bookedSeats = showtimeSeatRepository
                .countByShowtimeIdAndStatus(id, SeatStatus.BOOKED);
        if (bookedSeats > 0) {
            throw new IllegalArgumentException(
                    "Cannot update showtime — " + bookedSeats + " seat(s) already booked. Cancel the showtime instead.");
        }

        if (request.getShowDate() != null)
            showtime.setShowDate(request.getShowDate());
        if (request.getStartTime() != null)
            showtime.setStartTime(request.getStartTime());
        if (request.getEndTime() != null)
            showtime.setEndTime(request.getEndTime());
        if (request.getLanguageId() != null) {
            Language lang = languageRepository
                    .findById(request.getLanguageId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Language", "id", request.getLanguageId()));
            showtime.setLanguage(lang);
        }

        showtimeRepository.save(showtime);
        log.info("Showtime updated: id={}", id);

        return ApiResponse.success(
                "Showtime updated successfully.",
                buildShowtimeResponse(showtime)
        );
    }
    @Override
    public ApiResponse<String> cancelShowtime(Long id) {
        Showtime showtime = loadShowtimeOrThrow(id);
        checkOwnershipOrAdmin(showtime.getScreen().getTheater());

        if (showtime.getStatus() == ShowtimeStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "Showtime is already cancelled.");
        }

        showtime.setStatus(ShowtimeStatus.CANCELLED);
        showtimeRepository.save(showtime);
        List<ShowtimeSeat> lockedSeats = showtimeSeatRepository
                .findByShowtimeId(id)
                .stream()
                .filter(ss -> ss.getStatus() == SeatStatus.LOCKED)
                .collect(Collectors.toList());

        lockedSeats.forEach(ss -> {
            ss.setStatus(SeatStatus.AVAILABLE);
            ss.setLockedByUser(null);
            ss.setLockExpiresAt(null);
        });
        showtimeSeatRepository.saveAll(lockedSeats);

        log.info("Showtime cancelled: {} (id={})",
                showtime.getMovie().getTitle(), id);

        return ApiResponse.success("Showtime cancelled successfully. " + "Affected bookings will be notified.", null);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<ShowtimeResponse> getShowtimeById(Long id) {
        Showtime showtime = loadShowtimeOrThrow(id);
        return ApiResponse.success(
                "Showtime fetched.",
                buildShowtimeResponse(showtime)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<ShowtimeResponse>> searchShowtimes(ShowtimeSearchRequest request) {

        List<Showtime> showtimes = showtimeRepository
                .findShowtimesForMovieInCity(request.getMovieId(), request.getShowDate(), request.getCity());

        if (request.getLanguageId() != null) {
            showtimes = showtimes.stream()
                    .filter(sh -> sh.getLanguage().getId()
                            .equals(request.getLanguageId()))
                    .collect(Collectors.toList());
        }

        if (request.getScreenType() != null) {
            showtimes = showtimes.stream()
                    .filter(sh -> sh.getScreen().getScreenType()
                            == request.getScreenType())
                    .collect(Collectors.toList());
        }

        List<ShowtimeResponse> responses = showtimes.stream()
                .map(this::buildShowtimeResponse)
                .collect(Collectors.toList());

        return ApiResponse.success(
                "Showtimes fetched.", responses
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<ShowtimeResponse>> getShowtimesByTheaterAndDate(Long theaterId, LocalDate date) {

        List<Showtime> showtimes = showtimeRepository
                .findByScreenTheaterIdAndShowDateAndStatusOrderByStartTimeAsc(
                        theaterId, date, ShowtimeStatus.SCHEDULED);

        List<ShowtimeResponse> responses = showtimes.stream()
                .map(this::buildShowtimeResponse)
                .collect(Collectors.toList());

        return ApiResponse.success(
                "Theater showtimes fetched.", responses
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<LocalDate>> getAvailableDates(Long movieId, String city) {

        List<LocalDate> dates = showtimeRepository
                .findAvailableDatesForMovie(movieId, city, LocalDate.now());

        return ApiResponse.success("Available dates fetched.", dates);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<SeatMapResponse> getSeatMap(Long showtimeId) {

        Showtime showtime = loadShowtimeOrThrow(showtimeId);

        if (showtime.getStatus() == ShowtimeStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "This showtime has been cancelled.");
        }

        List<ShowtimeSeat> allSeats = showtimeSeatRepository.findByShowtimeId(showtimeId);

        if (allSeats.isEmpty()) {
            throw new IllegalArgumentException("No seat data found for this showtime. " + "Please contact support.");
        }

        Long currentUserId = null;
        try {
            currentUserId = securityUtil.getCurrentUserId();
        } catch (Exception e) {
        }

        SeatMapResponse seatMap =
                showtimeMapper.toSeatMapResponse(
                        showtime, allSeats, currentUserId);

        return ApiResponse.success("Seat map loaded.", seatMap);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<ShowtimeResponse>> getShowtimesByScreen(Long screenId) {

        screenRepository.findById(screenId)
                .orElseThrow(() -> new ScreenNotFoundException(screenId));

        List<Showtime> showtimes = showtimeRepository
                .findByScreenIdOrderByShowDateAscStartTimeAsc(screenId);

        List<ShowtimeResponse> responses = showtimes.stream()
                .map(this::buildShowtimeResponse)
                .collect(Collectors.toList());

        return ApiResponse.success("Screen schedule fetched.", responses
        );
    }

    @Override
    public void completePastShowtimes() {
        List<Showtime> past = showtimeRepository.findPastScheduledShowtimes(LocalDate.now());

        if (past.isEmpty()) return;

        past.forEach(sh -> sh.setStatus(ShowtimeStatus.COMPLETED));
        showtimeRepository.saveAll(past);

        log.info("Marked {} past showtimes as COMPLETED", past.size());
    }

    @Override
    public void releaseExpiredSeatLocks() {
        List<ShowtimeSeat> expired = showtimeSeatRepository.findExpiredLockedSeats(LocalDateTime.now());
        if (expired.isEmpty()) return;
        Map<Long, Long> releasedCountByShowtime = expired.stream()
                .collect(Collectors.groupingBy(
                        ss -> ss.getShowtime().getId(),
                        Collectors.counting()
                ));

        expired.forEach(ss -> {
            ss.setStatus(SeatStatus.AVAILABLE);
            ss.setLockedByUser(null);
            ss.setLockExpiresAt(null);
        });
        showtimeSeatRepository.saveAll(expired);
        releasedCountByShowtime.forEach((showtimeId, count) ->
                showtimeRepository.findById(showtimeId).ifPresent(st -> {
                    st.setAvailableSeats(st.getAvailableSeats() + count.intValue());
                    showtimeRepository.save(st);
                })
        );

        log.info("Released {} expired seat locks across {} showtimes",
                expired.size(), releasedCountByShowtime.size());
    }

    private void generateShowtimeSeats(Showtime showtime,
                                       List<Seat> seats,
                                       Screen screen) {

        Theater theater = screen.getTheater();

        Map<String, Double> priceMap = buildPriceMap(theater.getId(), screen.getScreenType());

        List<ShowtimeSeat> showtimeSeats = new ArrayList<>();

        for (Seat seat : seats) {
            String priceKey = seat.getCategory().name()
                    + "_" + screen.getScreenType().name();
            Double price = priceMap.getOrDefault(
                    priceKey, getDefaultPrice(seat.getCategory()));

            ShowtimeSeat ss = ShowtimeSeat.builder()
                    .showtime(showtime)
                    .seat(seat)
                    .status(SeatStatus.AVAILABLE)
                    .price(price)
                    .lockedByUser(null)
                    .lockExpiresAt(null)
                    .version(0)
                    .build();
            showtimeSeats.add(ss);
        }

        showtimeSeatRepository.saveAll(showtimeSeats);

        log.debug("Generated {} ShowtimeSeat records for showtime id={}",
                showtimeSeats.size(), showtime.getId());
    }

    private Map<String, Double> buildPriceMap(Long theaterId,
                                              ScreenType screenType) {
        return priceRuleRepository.findByTheaterId(theaterId)
                .stream()
                .filter(rule -> rule.getScreenType() == screenType)
                .collect(Collectors.toMap(
                        rule -> rule.getSeatCategory().name()
                                + "_" + rule.getScreenType().name(),
                        SeatPriceRule::getBasePrice
                ));
    }

    private Double getDefaultPrice(SeatCategory category) {
        return switch (category) {
            case REGULAR -> 150.0;
            case PREMIUM -> 250.0;
            case VIP -> 400.0;
            case RECLINER -> 500.0;
        };
    }

    private ShowtimeResponse buildShowtimeResponse(Showtime showtime) {
        List<ShowtimeSeat> seats = showtimeSeatRepository.findByShowtimeId(showtime.getId());

        Double minPrice = seats.stream()
                .mapToDouble(ShowtimeSeat::getPrice)
                .min()
                .orElse(0.0);

        Double maxPrice = seats.stream()
                .mapToDouble(ShowtimeSeat::getPrice)
                .max()
                .orElse(0.0);

        return showtimeMapper.toResponse(showtime, minPrice, maxPrice);
    }

    private Showtime loadShowtimeOrThrow(Long id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new ShowtimeNotFoundException(id));
    }

    private void checkOwnershipOrAdmin(Theater theater) {
        if (securityUtil.isAdmin()) return;
        Long currentUserId = securityUtil.getCurrentUserId();
        if (theater.getOwner() == null
                || !theater.getOwner().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException(
                    "You do not have permission to manage this theater's showtimes.");
        }
    }
}
