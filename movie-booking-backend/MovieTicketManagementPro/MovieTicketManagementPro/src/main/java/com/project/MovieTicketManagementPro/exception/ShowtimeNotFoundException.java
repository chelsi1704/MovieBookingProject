package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class ShowtimeNotFoundException extends BaseException {

    public ShowtimeNotFoundException(Long id) {
        super("Showtime not found with id: " + id, HttpStatus.NOT_FOUND);
    }
}
