package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class BookingExpiredException extends BaseException{

    public BookingExpiredException(String bookingRef) {
        super("Booking " + bookingRef + " has expired. Please start a new booking.",
                HttpStatus.GONE);
    }
}
