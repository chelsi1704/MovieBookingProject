package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class BookingCancellationNotAllowedException extends BaseException{

    public BookingCancellationNotAllowedException(String reason) {
        super("Cancellation not allowed: " + reason, HttpStatus.BAD_REQUEST);
    }
}
