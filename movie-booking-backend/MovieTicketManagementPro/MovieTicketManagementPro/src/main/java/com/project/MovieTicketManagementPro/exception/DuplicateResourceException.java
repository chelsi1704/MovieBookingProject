package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BaseException{

    public DuplicateResourceException(String resource, String field, Object value) {
        super(resource + " already exists with " + field + ": " + value,
                HttpStatus.CONFLICT);
    }
}
