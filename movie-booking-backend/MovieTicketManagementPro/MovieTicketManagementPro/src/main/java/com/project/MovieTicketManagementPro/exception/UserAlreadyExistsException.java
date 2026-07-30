package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends BaseException {


    public UserAlreadyExistsException(String email) {
        super("User already exists with email: " + email, HttpStatus.CONFLICT);
    }
}
