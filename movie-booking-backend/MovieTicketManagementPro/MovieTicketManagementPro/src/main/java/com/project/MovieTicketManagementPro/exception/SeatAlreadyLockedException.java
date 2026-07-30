package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class SeatAlreadyLockedException extends BaseException{

    public SeatAlreadyLockedException() {
        super("One or more selected seats are currently held by another user. " +
                "Please try again in a few minutes.", HttpStatus.CONFLICT);
    }
}
