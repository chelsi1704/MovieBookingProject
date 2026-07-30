package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.model.Booking;

public interface EmailService {

    void sendRegistrationOtpEmail(String email, String otpCode);

    void sendPasswordResetOtpEmail(String email, String otpCode);

    void sendBookingConfirmationEmail(Booking booking);

    void sendBookingCancellationEmail(Booking booking);
}