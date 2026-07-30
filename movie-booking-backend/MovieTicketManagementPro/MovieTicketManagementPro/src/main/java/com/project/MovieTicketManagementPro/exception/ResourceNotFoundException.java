package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String resource,
                                     String identifier,
                                     Object value) {
        super(resource + " not found with " + identifier + ": " + value,
                HttpStatus.NOT_FOUND);
    }

    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
