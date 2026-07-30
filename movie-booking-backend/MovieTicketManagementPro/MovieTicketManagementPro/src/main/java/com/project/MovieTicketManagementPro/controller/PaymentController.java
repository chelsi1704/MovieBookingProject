package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // POST /api/payments/initiate
    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>>
    initiatePayment(
            @Valid @RequestBody CreatePaymentOrderRequest request) {
        return ResponseEntity.ok(
                paymentService.initiatePayment(request));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<BookingResponse>>
    confirmPayment(
            @Valid @RequestBody
            PaymentVerificationRequest request) {
        return ResponseEntity.ok(
                paymentService.confirmPayment(request));
    }

    // GET /api/payments/booking/{bookingId}
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentSummaryResponse>>
    getPayment(@PathVariable Long bookingId) {
        return ResponseEntity.ok(
                paymentService.getPaymentByBooking(bookingId));
    }
}