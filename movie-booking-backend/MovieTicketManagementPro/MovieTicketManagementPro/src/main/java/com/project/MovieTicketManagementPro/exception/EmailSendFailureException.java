package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class EmailSendFailureException extends BaseException {

    public EmailSendFailureException(String email) {
        super("Failed to send email to: " + email,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
