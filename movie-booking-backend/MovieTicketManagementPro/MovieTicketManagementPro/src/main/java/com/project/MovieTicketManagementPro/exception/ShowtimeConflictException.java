package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalTime;

public class ShowtimeConflictException extends BaseException {

    public ShowtimeConflictException(String screenName, LocalTime start, LocalTime end) {
        super("Screen '" + screenName + "' already has a show scheduled between "
                        + start + " and " + end + ". Please choose a different time.",
                HttpStatus.CONFLICT);
    }
}
