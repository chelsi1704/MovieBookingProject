package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.model.BookingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>>
    getDashboard() {

        // Date ranges for today and this month
        LocalDateTime startOfDay = LocalDateTime.now()
                .toLocalDate().atStartOfDay();
        LocalDateTime startOfMonth = LocalDateTime.now()
                .withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        long totalUsers = userRepository.count();
        long newUsersToday = userRepository.countUserRegisteredBetween(startOfDay, now);

        long totalMovies = movieRepository.count();

        long totalTheaters = theaterRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository
                .findByDateRangeAndStatus(
                        LocalDateTime.MIN, now,
                        BookingStatus.CONFIRMED).size();
        long cancelledBookings = bookingRepository
                .findByDateRangeAndStatus(
                        LocalDateTime.MIN, now,
                        BookingStatus.CANCELLED).size();

        Double totalRevenue = paymentRepository
                .sumSuccessfulPayments(LocalDateTime.MIN, now);
        Double revenueToday = paymentRepository
                .sumSuccessfulPayments(startOfDay, now);
        Double revenueThisMonth = paymentRepository
                .sumSuccessfulPayments(startOfMonth, now);

        List<MovieRevenueResponse> topMovies = bookingRepository
                .getRevenuePerMovie()
                .stream()
                .limit(5)
                .map(row -> MovieRevenueResponse.builder()
                        .movieTitle((String) row[0])
                        .totalRevenue((Double) row[1])
                        .build())
                .collect(Collectors.toList());

        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .newUsersToday(newUsersToday)
                .totalMovies(totalMovies)
                .totalTheaters(totalTheaters)
                .totalBookings(totalBookings)
                .confirmedBookings(confirmedBookings)
                .cancelledBookings(cancelledBookings)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0)
                .revenueToday(revenueToday != null ? revenueToday : 0)
                .revenueThisMonth(revenueThisMonth != null
                        ? revenueThisMonth : 0)
                .topMoviesByRevenue(topMovies)
                .build();

        return ResponseEntity.ok(
                ApiResponse.success("Dashboard stats fetched.", stats));
    }
}