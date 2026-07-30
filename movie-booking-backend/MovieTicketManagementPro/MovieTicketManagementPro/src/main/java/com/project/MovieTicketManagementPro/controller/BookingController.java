package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request));
    }

    // GET /api/bookings/my — my booking history
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingSummaryResponse>>>
    getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // GET /api/bookings/ref/{bookingRef}
    @GetMapping("/ref/{bookingRef}")
    public ResponseEntity<ApiResponse<BookingResponse>> getByRef(
            @PathVariable String bookingRef) {
        return ResponseEntity.ok(
                bookingService.getBookingByRef(bookingRef));
    }

    // GET /api/bookings/{id}/tickets
    @GetMapping("/{id}/tickets")
    public ResponseEntity<ApiResponse<List<TicketResponse>>>
    getTickets(@PathVariable Long id) {
        return ResponseEntity.ok(
                bookingService.getTicketsForBooking(id));
    }

    // POST /api/bookings/cancel
    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<String>> cancelBooking(
            @Valid @RequestBody CancelBookingRequest request) {
        return ResponseEntity.ok(
                bookingService.cancelBooking(request));
    }

    // GET /api/bookings/showtime/{showtimeId} — ADMIN
    @GetMapping("/showtime/{showtimeId}")
    public ResponseEntity<ApiResponse<List<BookingSummaryResponse>>>
    getByShowtime(@PathVariable Long showtimeId) {
        return ResponseEntity.ok(
                bookingService.getBookingsByShowtime(showtimeId));
    }
}