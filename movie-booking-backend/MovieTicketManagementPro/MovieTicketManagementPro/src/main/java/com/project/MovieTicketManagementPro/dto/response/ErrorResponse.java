package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {

    private boolean success = false;
    private String message;
    private Map<String, String> errors;
    private int statusCode;
    private LocalDateTime timestamp = LocalDateTime.now();
}
