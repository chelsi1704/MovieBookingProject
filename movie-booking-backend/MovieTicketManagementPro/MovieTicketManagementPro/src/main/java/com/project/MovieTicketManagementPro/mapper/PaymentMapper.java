package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.PaymentSummaryResponse;
import com.project.MovieTicketManagementPro.dto.response.RefundResponse;
import com.project.MovieTicketManagementPro.model.Payment;
import com.project.MovieTicketManagementPro.model.Refund;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentSummaryResponse toSummaryResponse(Payment payment) {
        return PaymentSummaryResponse.builder()
                .id(payment.getId())
                .status(payment.getStatus().name())
                .method(payment.getMethod() != null
                        ? payment.getMethod().name() : null)
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .paidAt(payment.getPaidAt())
                .gatewayPaymentId(payment.getGatewayPaymentId())
                .build();
    }

    public RefundResponse toRefundResponse(Refund refund) {
        String expectedBy = refund.getRefundedAt() != null
                ? refund.getRefundedAt().plusDays(7)
                  .toLocalDate().toString()
                : "5–7 business days from cancellation";

        return RefundResponse.builder()
                .id(refund.getId())
                .gatewayRefundId(refund.getGatewayRefundId())
                .refundAmount(refund.getRefundAmount())
                .status(refund.getStatus().name())
                .reason(refund.getReason())
                .refundedAt(refund.getRefundedAt())
                .expectedBy(expectedBy)
                .build();
    }
}
