package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import java.util.List;

public interface BookingService {

    ApiResponse<BookingResponse> createBooking(
            CreateBookingRequest request);

    ApiResponse<BookingResponse> getBookingById(Long id);

    ApiResponse<BookingResponse> getBookingByRef(String bookingRef);

    ApiResponse<List<BookingSummaryResponse>> getMyBookings();

    ApiResponse<String> cancelBooking(CancelBookingRequest request);

    ApiResponse<List<TicketResponse>> getTicketsForBooking(
            Long bookingId);

    ApiResponse<List<BookingSummaryResponse>> getBookingsByShowtime(
            Long showtimeId);

    void expirePendingBookings();
}