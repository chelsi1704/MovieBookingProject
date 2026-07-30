package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.*;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.mapper.*;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.service.EmailService;
import com.project.MovieTicketManagementPro.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;
    private final BookingMapper bookingMapper;
    private final BookingServiceImpl bookingService;
    private final EmailService emailService;

    @Override
    public ApiResponse<PaymentOrderResponse> initiatePayment(
            CreatePaymentOrderRequest request) {

        Booking booking = bookingRepository
                .findByBookingRef(request.getBookingRef())
                .orElseThrow(() -> new BookingNotFoundException(
                        request.getBookingRef()));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new PaymentAlreadyDoneException(
                    request.getBookingRef());
        }

        if (booking.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BookingExpiredException(
                    request.getBookingRef());
        }

        if (paymentRepository.findByBookingId(
                booking.getId()).isPresent()) {
            Payment existing = paymentRepository
                    .findByBookingId(booking.getId()).get();
            return ApiResponse.success(
                    "Payment already initiated.",
                    buildOrderResponse(booking, existing));
        }

        String orderId = "ORD-" + UUID.randomUUID()
                .toString().toUpperCase().substring(0, 8);

        Payment payment = Payment.builder()
                .booking(booking)
                .gatewayOrderId(orderId)
                .amount(booking.getTotalAmount())
                .currency("INR")
                .status(PaymentStatus.INITIATED)
                .method(request.getPaymentMethod())
                .build();

        paymentRepository.save(payment);

        log.info("Payment initiated for booking: {} orderId: {}",
                booking.getBookingRef(), orderId);

        return ApiResponse.success(
                "Payment order created. Please complete payment.",
                buildOrderResponse(booking, payment));
    }

    @Override
    public ApiResponse<BookingResponse> confirmPayment(
            PaymentVerificationRequest request) {

        Booking booking = bookingRepository
                .findByBookingRef(request.getBookingRef())
                .orElseThrow(() -> new BookingNotFoundException(
                        request.getBookingRef()));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new PaymentAlreadyDoneException(
                    request.getBookingRef());
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new PaymentFailedException(
                    "Booking is not in a payable state. " +
                            "Status: " + booking.getStatus());
        }

        if (booking.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BookingExpiredException(
                    request.getBookingRef());
        }

        Payment payment = paymentRepository
                .findByBookingId(booking.getId())
                .orElseGet(() -> Payment.builder()
                        .booking(booking)
                        .amount(booking.getTotalAmount())
                        .currency("INR")
                        .build());

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setMethod(request.getPaymentMethod());
        payment.setPaidAt(LocalDateTime.now());
        payment.setGatewayPaymentId("PAY-"
                + UUID.randomUUID().toString()
                .toUpperCase().substring(0, 8));
        paymentRepository.save(payment);

        Booking confirmed =
                bookingService.confirmBookingAndGenerateTickets(
                        booking);

        emailService.sendBookingConfirmationEmail(confirmed);

        log.info("Payment confirmed for booking: {}",
                booking.getBookingRef());

        return ApiResponse.success(
                "Payment successful! Your booking is confirmed.",
                bookingMapper.toResponse(confirmed));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PaymentSummaryResponse> getPaymentByBooking(
            Long bookingId) {

        Payment payment = paymentRepository
                .findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment", "bookingId", bookingId));

        return ApiResponse.success(
                "Payment fetched.",
                paymentMapper.toSummaryResponse(payment));
    }

    private PaymentOrderResponse buildOrderResponse(
            Booking booking, Payment payment) {
        return PaymentOrderResponse.builder()
                .orderId(payment.getGatewayOrderId())
                .amount(booking.getTotalAmount())
                .currency("INR")
                .bookingRef(booking.getBookingRef())
                .description(booking.getTotalSeats()
                        + " ticket(s) for "
                        + booking.getShowtime().getMovie().getTitle()
                        + " at "
                        + booking.getShowtime().getScreen()
                        .getTheater().getName())
                .expiresAt(booking.getExpiresAt())
                .build();
    }
}