package com.project.MovieTicketManagementPro.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class SeatNotAvailableException extends BaseException {

    public SeatNotAvailableException(String seatLabel) {
        super("Seat " + seatLabel + " is no longer available. Please select another seat.",
                HttpStatus.CONFLICT);
    }

    public SeatNotAvailableException(List<String> seatLabels) {
        super("The following seats are no longer available: "
                        + String.join(", ", seatLabels)
                        + ". Please select other seats.",
                HttpStatus.CONFLICT);
    }

}
