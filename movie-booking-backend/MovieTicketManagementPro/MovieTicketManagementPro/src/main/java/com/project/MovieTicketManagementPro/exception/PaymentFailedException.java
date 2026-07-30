package com.project.MovieTicketManagementPro.exception;

import com.fasterxml.jackson.databind.ser.Serializers;
import org.springframework.http.HttpStatus;

public class PaymentFailedException extends BaseException {

    public PaymentFailedException(String message) {
        super("Payment failed: " + message, HttpStatus.PAYMENT_REQUIRED);
    }
}
