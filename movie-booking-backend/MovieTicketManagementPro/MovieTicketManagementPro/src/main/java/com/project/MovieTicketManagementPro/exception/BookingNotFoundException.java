package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class BookingNotFoundException extends BaseException {

    public BookingNotFoundException(Long id) {
        super("Booking not found with id: " + id, HttpStatus.NOT_FOUND);
    }

    public BookingNotFoundException(String bookingRef) {
        super("Booking not found with ref: " + bookingRef, HttpStatus.NOT_FOUND);
    }
}
