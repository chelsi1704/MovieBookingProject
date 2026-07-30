package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class TheaterNotFoundException extends BaseException{

    public TheaterNotFoundException(Long id) {
        super("Theater not found with id: " + id, HttpStatus.NOT_FOUND);
    }
}
