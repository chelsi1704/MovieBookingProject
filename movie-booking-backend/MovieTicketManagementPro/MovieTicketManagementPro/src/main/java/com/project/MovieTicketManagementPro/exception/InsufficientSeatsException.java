package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class InsufficientSeatsException extends BaseException {

    public InsufficientSeatsException(int requested, int available) {
        super("Not enough seats available. Requested: " + requested
                + ", Available: " + available, HttpStatus.BAD_REQUEST);
    }
}
