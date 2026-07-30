package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerificationRequest {

    @NotBlank(message = "Booking reference is required")
    private String bookingRef;

    @NotBlank(message = "Card number is required")
    @Size(min = 16, max = 16, message = "Card number must be 16 digits")
    private String cardNumber;

    @NotBlank(message = "Expiry is required")
    private String expiry;

    @NotBlank(message = "CVV is required")
    @Size(min = 3, max = 4)
    private String cvv;

    @NotBlank(message = "Card holder name is required")
    private String cardHolderName;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
