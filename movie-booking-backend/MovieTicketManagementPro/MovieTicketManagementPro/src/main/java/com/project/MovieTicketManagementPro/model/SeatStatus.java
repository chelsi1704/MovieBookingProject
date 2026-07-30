package com.project.MovieTicketManagementPro.model;

public enum SeatStatus {
    AVAILABLE,  // free to book
    LOCKED,     // held by a user for 10 mins during checkout
    BOOKED
}
