package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class OfferUsageLimitReachedException extends BaseException {

    public OfferUsageLimitReachedException(String code) {
        super("Offer '" + code + "' has reached its maximum usage limit.",
                HttpStatus.BAD_REQUEST);
    }
}
