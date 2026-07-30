package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.DuplicateResourceException;
import com.project.MovieTicketManagementPro.exception.ScreenNotFoundException;
import com.project.MovieTicketManagementPro.exception.TheaterNotFoundException;
import com.project.MovieTicketManagementPro.exception.UnauthorizedAccessException;
import com.project.MovieTicketManagementPro.mapper.TheaterMapper;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import com.project.MovieTicketManagementPro.service.TheaterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TheaterServiceImpl implements TheaterService {

    private final TheaterRepository theaterRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final SeatPriceRuleRepository priceRuleRepository;
    private final TheaterAmenityRepository amenityRepository;
    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final UserRepository userRepository;
    private final TheaterMapper theaterMapper;
    private final SecurityUtil securityUtil;

    @Override
    public ApiResponse<TheaterDetailResponse> createTheater(
            CreateTheaterRequest request) {

        if (theaterRepository.existsByNameIgnoreCaseAndCityIgnoreCase(
                request.getName(), request.getCity())) {
            throw new DuplicateResourceException(
                    "Theater", "name in city",
                    request.getName() + ", " + request.getCity());
        }

        User owner = securityUtil.getCurrentUser();

        Theater theater = Theater.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .phone(request.getPhone())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isActive(true)
                .owner(owner)
                .build();

        Theater saved = theaterRepository.save(theater);

        if (request.getAmenities() != null
                && !request.getAmenities().isEmpty()) {
            saveAmenities(saved, request.getAmenities());
        }

        log.info("Theater created: {} in {} (id={})",
                saved.getName(), saved.getCity(), saved.getId());

        Theater full = loadTheaterWithAssociations(saved.getId());
        return ApiResponse.success(
                "Theater created successfully.",
                theaterMapper.toDetailResponse(full)
        );
    }

    @Override
    public ApiResponse<TheaterDetailResponse> updateTheater(
            Long id, UpdateTheaterRequest request) {

        Theater theater = loadTheaterOrThrow(id);

        checkOwnershipOrAdmin(theater);

        if (request.getName() != null)
            theater.setName(request.getName());
        if (request.getAddress() != null)
            theater.setAddress(request.getAddress());
        if (request.getCity() != null)
            theater.setCity(request.getCity());
        if (request.getState() != null)
            theater.setState(request.getState());
        if (request.getPincode() != null)
            theater.setPincode(request.getPincode());
        if (request.getPhone() != null)
            theater.setPhone(request.getPhone());
        if (request.getLatitude() != null)
            theater.setLatitude(request.getLatitude());
        if (request.getLongitude() != null)
            theater.setLongitude(request.getLongitude());
        if (request.getIsActive() != null)
            theater.setActive(request.getIsActive());

        theaterRepository.save(theater);

        if (request.getAmenities() != null) {
            amenityRepository.deleteByTheaterId(id);
            if (!request.getAmenities().isEmpty()) {
                saveAmenities(theater, request.getAmenities());
            }
        }

        log.info("Theater updated: {} (id={})", theater.getName(), id);

        Theater updated = loadTheaterWithAssociations(id);
        return ApiResponse.success(
                "Theater updated successfully.",
                theaterMapper.toDetailResponse(updated)
        );
    }

    @Override
    public ApiResponse<String> deactivateTheater(Long id) {
        Theater theater = loadTheaterOrThrow(id);
        theater.setActive(false);
        theaterRepository.save(theater);
        log.info("Theater deactivated: {} (id={})", theater.getName(), id);
        return ApiResponse.success(
                "Theater deactivated successfully.", null
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<TheaterDetailResponse> getTheaterById(Long id) {
        Theater theater = loadTheaterWithAssociations(id);
        return ApiResponse.success(
                "Theater fetched successfully.",
                theaterMapper.toDetailResponse(theater)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<TheaterSummaryResponse>> getTheatersByCity(
            String city) {

        List<Theater> theaters = theaterRepository
                .findByCityIgnoreCaseAndIsActive(city, true);

        List<TheaterSummaryResponse> responses = theaters.stream()
                .map(theaterMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return ApiResponse.success(
                "Theaters in " + city + " fetched.", responses
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<TheaterSummaryResponse>> getNearbyTheaters(
            NearbyTheaterRequest request) {

        List<Theater> theaters = theaterRepository.findNearbyTheaters(
                request.getLatitude(),
                request.getLongitude(),
                request.getRadiusKm()
        );

        List<TheaterSummaryResponse> responses = theaters.stream()
                .map(theater -> {
                    Double distance = calculateDistanceKm(
                            request.getLatitude(), request.getLongitude(),
                            theater.getLatitude(), theater.getLongitude()
                    );
                    return theaterMapper.toSummaryResponse(theater, distance);
                })
                .collect(Collectors.toList());

        return ApiResponse.success(
                "Found " + responses.size() + " theaters within "
                        + request.getRadiusKm() + " km.",
                responses
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<TheaterSummaryResponse>> getTheatersShowingMovie(
            Long movieId, String city, LocalDate date) {

        List<Theater> theaters = theaterRepository
                .findTheatersShowingMovie(movieId, city, date);

        List<TheaterSummaryResponse> responses = theaters.stream()
                .map(theaterMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return ApiResponse.success(
                "Theaters showing movie fetched.", responses
        );
    }

    @Override
    public ApiResponse<ScreenResponse> addScreen(
            Long theaterId, CreateScreenRequest request) {

        Theater theater = loadTheaterOrThrow(theaterId);
        checkOwnershipOrAdmin(theater);

        int totalSeats = request.getSeatLayout().stream()
                .mapToInt(SeatRowRequest::getNumberOfSeats)
                .sum();

        if (request.getTotalSeats() != totalSeats) {
            throw new IllegalArgumentException(
                    "Total seats in layout (" + totalSeats +
                            ") does not match declared total (" +
                            request.getTotalSeats() + ")");
        }

        Screen screen = Screen.builder()
                .screenName(request.getScreenName())
                .screenType(request.getScreenType())
                .totalSeats(totalSeats)
                .isActive(true)
                .theater(theater)
                .build();

        Screen savedScreen = screenRepository.save(screen);

        generateSeats(savedScreen, request.getSeatLayout());

        log.info("Screen added: {} to theater {} with {} seats",
                savedScreen.getScreenName(), theater.getName(), totalSeats);

        return ApiResponse.success(
                "Screen added successfully.",
                theaterMapper.toScreenResponse(savedScreen)
        );
    }

    @Override
    public ApiResponse<String> deactivateScreen(Long screenId) {
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ScreenNotFoundException(screenId));

        checkOwnershipOrAdmin(screen.getTheater());
        screen.setActive(false);
        screenRepository.save(screen);

        return ApiResponse.success(
                "Screen deactivated successfully.", null
        );
    }

    @Override
    public ApiResponse<SeatPriceRuleResponse> setSeatPriceRule(
            Long theaterId, CreateSeatPriceRuleRequest request) {

        Theater theater = loadTheaterOrThrow(theaterId);
        checkOwnershipOrAdmin(theater);

        Optional<SeatPriceRule> existing =
                priceRuleRepository.findByTheaterIdAndSeatCategoryAndScreenType(
                        theaterId,
                        request.getSeatCategory(),
                        request.getScreenType()
                );

        SeatPriceRule rule;
        if (existing.isPresent()) {
            rule = existing.get();
            rule.setBasePrice(request.getBasePrice());
        } else {
            rule = SeatPriceRule.builder()
                    .theater(theater)
                    .seatCategory(request.getSeatCategory())
                    .screenType(request.getScreenType())
                    .basePrice(request.getBasePrice())
                    .build();
        }

        SeatPriceRule saved = priceRuleRepository.save(rule);

        log.info("Price rule set for theater {}: {} {} = {}",
                theaterId, request.getSeatCategory(),
                request.getScreenType(), request.getBasePrice());

        return ApiResponse.success(
                "Price rule saved successfully.",
                theaterMapper.toPriceRuleResponse(saved)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<SeatPriceRuleResponse>> getPriceRules(
            Long theaterId) {

        loadTheaterOrThrow(theaterId); // verify theater exists

        List<SeatPriceRuleResponse> rules =
                priceRuleRepository.findByTheaterId(theaterId)
                        .stream()
                        .map(theaterMapper::toPriceRuleResponse)
                        .collect(Collectors.toList());

        return ApiResponse.success("Price rules fetched.", rules);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<TheaterSummaryResponse>> getAllTheaters(
            Pageable pageable) {

        Page<Theater> page = theaterRepository.findAll(pageable);

        PageResponse<TheaterSummaryResponse> response =
                PageResponse.<TheaterSummaryResponse>builder()
                        .content(page.getContent().stream()
                                .map(theaterMapper::toSummaryResponse)
                                .collect(Collectors.toList()))
                        .pageNumber(page.getNumber())
                        .pageSize(page.getSize())
                        .totalElements(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .isFirst(page.isFirst())
                        .isLast(page.isLast())
                        .build();

        return ApiResponse.success("All theaters fetched.", response);
    }

    private Theater loadTheaterOrThrow(Long id) {
        return theaterRepository.findById(id)
                .orElseThrow(() -> new TheaterNotFoundException(id));
    }

    private Theater loadTheaterWithAssociations(Long id) {
        Theater t = loadTheaterOrThrow(id);
        if (t.getScreens() != null) t.getScreens().size();
        if (t.getAmenities() != null) t.getAmenities().size();
        if (t.getPriceRules() != null) t.getPriceRules().size();
        return t;
    }

    private void saveAmenities(Theater theater, List<String> amenityNames) {
        List<TheaterAmenity> amenities = amenityNames.stream()
                .map(name -> TheaterAmenity.builder()
                        .name(name)
                        .theater(theater)
                        .build())
                .collect(Collectors.toList());
        amenityRepository.saveAll(amenities);
    }

    private void generateSeats(Screen screen,
                               List<SeatRowRequest> layout) {
        List<Seat> seats = new ArrayList<>();
        for (SeatRowRequest row : layout) {
            for (int seatNum = 1;
                 seatNum <= row.getNumberOfSeats();
                 seatNum++) {

                if (!seatRepository.existsByScreenIdAndRowLabelAndSeatNumber(
                        screen.getId(), row.getRowLabel(), seatNum)) {

                    seats.add(Seat.builder()
                            .screen(screen)
                            .rowLabel(row.getRowLabel())
                            .seatNumber(seatNum)
                            .category(row.getCategory())
                            .isActive(true)
                            .build());
                }
            }
        }
        seatRepository.saveAll(seats);
        log.debug("Generated {} seats for screen {}",
                seats.size(), screen.getScreenName());
    }

    private Double calculateDistanceKm(Double lat1, Double lon1,
                                       Double lat2, Double lon2) {
        final int EARTH_RADIUS_KM = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2)
                * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(EARTH_RADIUS_KM * c * 10.0) / 10.0; // 1 decimal
    }

    private void checkOwnershipOrAdmin(Theater theater) {
        if (securityUtil.isAdmin()) return;
        Long currentUserId = securityUtil.getCurrentUserId();
        if (theater.getOwner() == null
                || !theater.getOwner().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException(
                    "You do not have permission to modify this theater.");
        }
    }
}
