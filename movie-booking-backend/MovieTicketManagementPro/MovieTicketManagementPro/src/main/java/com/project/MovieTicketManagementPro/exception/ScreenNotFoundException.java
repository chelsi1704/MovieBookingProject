package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class ScreenNotFoundException extends BaseException {

    public ScreenNotFoundException(Long id) {
        super("Screen not found with id: " + id, HttpStatus.NOT_FOUND);
    }

}
