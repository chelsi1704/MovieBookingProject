package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class AccountDisabledException extends BaseException {

    public AccountDisabledException() {
        super("Your account has been disabled. Please contact support.",
                HttpStatus.FORBIDDEN);
    }
}
