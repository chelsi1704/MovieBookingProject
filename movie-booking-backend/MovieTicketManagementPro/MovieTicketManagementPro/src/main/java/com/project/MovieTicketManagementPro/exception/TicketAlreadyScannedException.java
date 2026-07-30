package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class TicketAlreadyScannedException extends BaseException {

    public TicketAlreadyScannedException(String ticketCode) {
        super("Ticket " + ticketCode + " has already been scanned.",
                HttpStatus.CONFLICT);
    }
}
