package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class ReviewAlreadyExistsException extends BaseException {

    public ReviewAlreadyExistsException() {
        super("You have already reviewed this movie.", HttpStatus.CONFLICT);
    }
}
