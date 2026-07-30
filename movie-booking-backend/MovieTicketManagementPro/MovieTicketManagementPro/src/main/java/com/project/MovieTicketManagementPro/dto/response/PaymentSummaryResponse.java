package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSummaryResponse {

    private Long id;
    private String status;
    private String method;
    private Double amount;
    private String currency;
    private LocalDateTime paidAt;
    private String gatewayPaymentId;
}
