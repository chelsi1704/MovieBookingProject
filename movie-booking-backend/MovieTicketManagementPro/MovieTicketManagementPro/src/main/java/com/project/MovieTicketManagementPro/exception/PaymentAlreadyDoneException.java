package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class PaymentAlreadyDoneException extends BaseException {

    public PaymentAlreadyDoneException(String bookingRef) {
        super("Payment already completed for booking: " + bookingRef,
                HttpStatus.CONFLICT);
    }
}
