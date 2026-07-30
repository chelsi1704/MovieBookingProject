package com.project.MovieTicketManagementPro.exception;

import com.fasterxml.jackson.databind.ser.Serializers;
import org.springframework.http.HttpStatus;

public class AccountNotVerifiedException extends BaseException {

    public AccountNotVerifiedException() {
        super("Account not verified. Please verify your email to continue.",
                HttpStatus.FORBIDDEN);
    }
}
