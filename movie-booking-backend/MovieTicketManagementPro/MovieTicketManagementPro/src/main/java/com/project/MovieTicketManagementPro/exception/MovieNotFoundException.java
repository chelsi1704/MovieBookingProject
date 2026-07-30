package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class MovieNotFoundException extends BaseException {

    public MovieNotFoundException(Long id) {
        super("Movie not found with id: " + id, HttpStatus.NOT_FOUND);
    }
}
