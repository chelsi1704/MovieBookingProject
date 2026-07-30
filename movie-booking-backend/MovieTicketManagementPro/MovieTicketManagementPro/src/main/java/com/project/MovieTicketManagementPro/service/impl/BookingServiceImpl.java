package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.mapper.*;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.service.BookingService;
import com.project.MovieTicketManagementPro.service.NotificationService;
import com.project.MovieTicketManagementPro.util.BookingRefGenerator;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import com.project.MovieTicketManagementPro.util.TicketCodeGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final TicketMapper ticketMapper;
    private final SecurityUtil securityUtil;
    private final BookingRefGenerator bookingRefGenerator;
    private final TicketCodeGenerator ticketCodeGenerator;
    private final NotificationService notificationService;

    @Value("${app.payment.convenience-fee:30.0}")
    private Double convenienceFee;

    @Value("${app.booking.expiry-minutes:10}")
    private Integer expiryMinutes;

    private static final int SEAT_LOCK_MINUTES = 10;

    @Override
    public ApiResponse<BookingResponse> createBooking(
            CreateBookingRequest request) {

        Showtime showtime = showtimeRepository
                .findById(request.getShowtimeId())
                .orElseThrow(() -> new ShowtimeNotFoundException(
                        request.getShowtimeId()));

        if (showtime.getStatus() != ShowtimeStatus.SCHEDULED) {
            throw new IllegalArgumentException(
                    "This showtime is no longer available for booking.");
        }

        User user = securityUtil.getCurrentUser();

        List<ShowtimeSeat> requestedSeats =
                showtimeSeatRepository.findByIdInAndShowtimeId(
                        request.getShowtimeSeatIds(),
                        request.getShowtimeId());

        if (requestedSeats.size()
                != request.getShowtimeSeatIds().size()) {
            throw new SeatNotAvailableException(
                    "One or more selected seats not found " +
                            "for this showtime.");
        }

        List<String> unavailable = requestedSeats.stream()
                .filter(ss -> ss.getStatus() != SeatStatus.AVAILABLE)
                .map(ss -> ss.getSeat().getRowLabel()
                        + ss.getSeat().getSeatNumber())
                .collect(Collectors.toList());

        if (!unavailable.isEmpty()) {
            throw new SeatNotAvailableException(unavailable);
        }

        LocalDateTime lockExpiry = LocalDateTime.now()
                .plusMinutes(SEAT_LOCK_MINUTES);

        requestedSeats.forEach(ss -> {
            ss.setStatus(SeatStatus.LOCKED);
            ss.setLockedByUser(user);
            ss.setLockExpiresAt(lockExpiry);
        });
        showtimeSeatRepository.saveAll(requestedSeats);

        double subtotal = requestedSeats.stream()
                .mapToDouble(ShowtimeSeat::getPrice)
                .sum();
        double total = subtotal + convenienceFee;

        Booking booking = Booking.builder()
                .bookingRef(bookingRefGenerator.generate())
                .user(user)
                .showtime(showtime)
                .totalSeats(requestedSeats.size())
                .subtotal(subtotal)
                .convenienceFee(convenienceFee)
                .totalAmount(total)
                .status(BookingStatus.PENDING)
                .expiresAt(LocalDateTime.now()
                        .plusMinutes(expiryMinutes))
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        List<BookingSeat> bookingSeats = requestedSeats.stream()
                .map(ss -> BookingSeat.builder()
                        .booking(savedBooking)
                        .showtimeSeat(ss)
                        .priceAtBooking(ss.getPrice())
                        .build())
                .collect(Collectors.toList());

        bookingSeatRepository.saveAll(bookingSeats);

        showtime.setAvailableSeats(
                showtime.getAvailableSeats() - requestedSeats.size());
        showtimeRepository.save(showtime);

        log.info("Booking created: {} for user {} ({} seats)",
                savedBooking.getBookingRef(),
                user.getEmail(),
                requestedSeats.size());

        Booking fullBooking = bookingRepository
                .findById(savedBooking.getId()).orElseThrow();

        return ApiResponse.success(
                "Booking created! Please complete payment within "
                        + expiryMinutes + " minutes.",
                bookingMapper.toResponse(fullBooking));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<BookingResponse> getBookingById(Long id) {
        Booking booking = loadBookingOrThrow(id);
        checkBookingOwnership(booking);
        return ApiResponse.success(
                "Booking fetched.",
                bookingMapper.toResponse(booking));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<BookingResponse> getBookingByRef(
            String bookingRef) {
        Booking booking = bookingRepository
                .findByBookingRef(bookingRef)
                .orElseThrow(() -> new BookingNotFoundException(
                        bookingRef));
        checkBookingOwnership(booking);
        return ApiResponse.success(
                "Booking fetched.",
                bookingMapper.toResponse(booking));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<BookingSummaryResponse>> getMyBookings() {
        Long userId = securityUtil.getCurrentUserId();
        List<BookingSummaryResponse> bookings =
                bookingRepository
                        .findByUserIdOrderByBookedAtDesc(userId)
                        .stream()
                        .map(bookingMapper::toSummaryResponse)
                        .collect(Collectors.toList());
        return ApiResponse.success("Bookings fetched.", bookings);
    }

    @Override
    public ApiResponse<String> cancelBooking(
            CancelBookingRequest request) {

        Booking booking = loadBookingOrThrow(request.getBookingId());
        checkBookingOwnership(booking);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingCancellationNotAllowedException(
                    "Booking is already cancelled.");
        }
        if (booking.getStatus() == BookingStatus.EXPIRED) {
            throw new BookingCancellationNotAllowedException(
                    "Expired bookings cannot be cancelled.");
        }

        List<ShowtimeSeat> seatsToRelease =
                bookingSeatRepository.findByBookingId(booking.getId())
                        .stream()
                        .map(BookingSeat::getShowtimeSeat)
                        .collect(Collectors.toList());

        seatsToRelease.forEach(ss -> {
            ss.setStatus(SeatStatus.AVAILABLE);
            ss.setLockedByUser(null);
            ss.setLockExpiresAt(null);
        });
        showtimeSeatRepository.saveAll(seatsToRelease);

        Showtime showtime = booking.getShowtime();
        showtime.setAvailableSeats(
                showtime.getAvailableSeats() + seatsToRelease.size());
        showtimeRepository.save(showtime);

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        notificationService.sendBookingCancelledNotification(booking);

        log.info("Booking cancelled: {}", booking.getBookingRef());

        return ApiResponse.success(
                "Booking cancelled successfully. "
                        + "Refund will be processed in 5-7 business days.",
                null);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<TicketResponse>> getTicketsForBooking(
            Long bookingId) {

        Booking booking = loadBookingOrThrow(bookingId);
        checkBookingOwnership(booking);

        List<TicketResponse> tickets =
                ticketRepository.findByBookingId(bookingId)
                        .stream()
                        .map(ticketMapper::toResponse)
                        .collect(Collectors.toList());

        return ApiResponse.success("Tickets fetched.", tickets);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<BookingSummaryResponse>> getBookingsByShowtime(
            Long showtimeId) {

        List<BookingSummaryResponse> bookings =
                bookingRepository.findByShowtimeId(showtimeId)
                        .stream()
                        .map(bookingMapper::toSummaryResponse)
                        .collect(Collectors.toList());

        return ApiResponse.success(
                "Showtime bookings fetched.", bookings);
    }

    @Override
    public void expirePendingBookings() {
        List<Booking> expired = bookingRepository
                .findExpiredPendingBookings(LocalDateTime.now());

        if (expired.isEmpty()) return;

        expired.forEach(booking -> {
            List<ShowtimeSeat> seats =
                    bookingSeatRepository
                            .findByBookingId(booking.getId())
                            .stream()
                            .map(BookingSeat::getShowtimeSeat)
                            .collect(Collectors.toList());

            seats.forEach(ss -> {
                ss.setStatus(SeatStatus.AVAILABLE);
                ss.setLockedByUser(null);
                ss.setLockExpiresAt(null);
            });
            showtimeSeatRepository.saveAll(seats);

            Showtime showtime = booking.getShowtime();
            showtime.setAvailableSeats(
                    showtime.getAvailableSeats() + seats.size());
            showtimeRepository.save(showtime);

            booking.setStatus(BookingStatus.EXPIRED);
        });

        bookingRepository.saveAll(expired);
        log.info("Expired {} pending bookings", expired.size());
    }

    public Booking confirmBookingAndGenerateTickets(Booking booking) {

        List<BookingSeat> bookingSeats =
                bookingSeatRepository.findByBookingId(booking.getId());

        List<ShowtimeSeat> seats = bookingSeats.stream()
                .map(BookingSeat::getShowtimeSeat)
                .collect(Collectors.toList());

        seats.forEach(ss -> {
            ss.setStatus(SeatStatus.BOOKED);
            ss.setLockedByUser(null);
            ss.setLockExpiresAt(null);
        });
        showtimeSeatRepository.saveAll(seats);

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking confirmed = bookingRepository.save(booking);
        List<Ticket> tickets = new ArrayList<>();
        for (BookingSeat bs : bookingSeats) {
            Seat seat = bs.getShowtimeSeat().getSeat();
            String ticketCode = ticketCodeGenerator.generate(
                    booking.getBookingRef(),
                    seat.getRowLabel(),
                    seat.getSeatNumber());

            Ticket ticket = Ticket.builder()
                    .booking(confirmed)
                    .bookingSeat(bs)
                    .ticketCode(ticketCode)
                    .qrUrl("/api/tickets/qr/" + ticketCode)
                    .isScanned(false)
                    .build();
            tickets.add(ticket);
        }
        ticketRepository.saveAll(tickets);
        notificationService.sendBookingConfirmedNotification(confirmed);

        log.info("Booking confirmed and {} tickets generated for {}",
                tickets.size(), booking.getBookingRef());

        return confirmed;
    }


    private Booking loadBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
    }
    private void checkBookingOwnership(Booking booking) {
        Long currentUserId = securityUtil.getCurrentUserId();
        if (!booking.getUser().getId().equals(currentUserId)
                && !securityUtil.isAdmin()) {
            throw new UnauthorizedAccessException(
                    "You do not have permission to access this booking.");
        }
    }
}