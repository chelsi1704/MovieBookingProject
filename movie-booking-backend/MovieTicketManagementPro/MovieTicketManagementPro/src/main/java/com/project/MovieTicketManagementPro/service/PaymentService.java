package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;

public interface PaymentService {

    ApiResponse<PaymentOrderResponse> initiatePayment(
            CreatePaymentOrderRequest request);

    ApiResponse<BookingResponse> confirmPayment(
            PaymentVerificationRequest request);

    ApiResponse<PaymentSummaryResponse> getPaymentByBooking(
            Long bookingId);
}