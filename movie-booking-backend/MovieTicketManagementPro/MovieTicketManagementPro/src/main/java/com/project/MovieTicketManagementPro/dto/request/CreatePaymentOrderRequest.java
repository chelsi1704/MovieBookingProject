package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentOrderRequest {

    @NotNull
    private String bookingRef;

    @NotNull
    private PaymentMethod paymentMethod;
}