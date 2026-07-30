package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class TokenExpiredException extends BaseException {

    public TokenExpiredException() {
        super("Token has expired. Please refresh your session.", HttpStatus.UNAUTHORIZED);
    }
}
