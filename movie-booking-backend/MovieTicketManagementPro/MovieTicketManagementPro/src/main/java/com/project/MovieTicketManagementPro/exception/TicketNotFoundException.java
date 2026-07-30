package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class TicketNotFoundException extends BaseException {

    public TicketNotFoundException(String ticketCode) {
        super("Ticket not found with code: " + ticketCode, HttpStatus.NOT_FOUND);
    }
}
