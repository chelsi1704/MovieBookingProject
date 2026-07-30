package com.project.MovieTicketManagementPro.model;

public enum BookingStatus {
    PENDING,     // seats locked, payment not done
    CONFIRMED,   // payment success
    CANCELLED,   // user cancelled or payment failed
    EXPIRED
}
