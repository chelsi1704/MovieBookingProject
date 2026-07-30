package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class OfferNotFoundException extends BaseException {

    public OfferNotFoundException(String code) {
        super("Offer not found with code: " + code, HttpStatus.NOT_FOUND);
    }
}
