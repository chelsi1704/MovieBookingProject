package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class OfferExpiredException extends BaseException {

    public OfferExpiredException(String code) {
        super("Offer '" + code + "' has expired.", HttpStatus.BAD_REQUEST);
    }

}
