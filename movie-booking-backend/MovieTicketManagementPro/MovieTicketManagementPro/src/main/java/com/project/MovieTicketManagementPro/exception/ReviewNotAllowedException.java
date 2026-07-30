package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class ReviewNotAllowedException extends BaseException {

    public ReviewNotAllowedException() {
        super("You can only review movies you have watched.",
                HttpStatus.FORBIDDEN);
    }
}
