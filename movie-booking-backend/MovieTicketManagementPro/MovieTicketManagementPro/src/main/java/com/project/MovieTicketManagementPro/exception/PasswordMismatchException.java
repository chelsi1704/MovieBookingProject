package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class PasswordMismatchException extends BaseException {

    public PasswordMismatchException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
