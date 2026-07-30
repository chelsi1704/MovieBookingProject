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
public class RefundResponse {

    private Long id;
    private String gatewayRefundId;
    private Double refundAmount;
    private String status;
    private String reason;
    private LocalDateTime refundedAt;
    private String expectedBy;
}
