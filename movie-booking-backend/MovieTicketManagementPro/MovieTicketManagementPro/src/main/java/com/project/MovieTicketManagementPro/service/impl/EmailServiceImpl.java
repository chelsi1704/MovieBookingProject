package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.model.Booking;
import com.project.MovieTicketManagementPro.model.BookingSeat;
import com.project.MovieTicketManagementPro.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async("asyncExecutor")
    @Override
    public void sendRegistrationOtpEmail(String email,
                                         String otpCode) {
        String subject = "Verify your MovieBook account";
        String body = buildOtpEmailHtml(
                "Email Verification",
                "Thank you for registering with MovieBook!",
                otpCode,
                "This OTP is valid for 10 minutes.");
        sendHtmlEmail(email, subject, body);
    }

    @Async("asyncExecutor")
    @Override
    public void sendPasswordResetOtpEmail(String email,
                                          String otpCode) {
        String subject = "Password Reset OTP — MovieBook";
        String body = buildOtpEmailHtml(
                "Password Reset",
                "We received a request to reset your password.",
                otpCode,
                "This OTP is valid for 10 minutes. " +
                        "If you did not request this, ignore this email.");
        sendHtmlEmail(email, subject, body);
    }

    @Async("asyncExecutor")
    @Override
    public void sendBookingConfirmationEmail(Booking booking) {
        String subject = "Booking Confirmed! — "
                + booking.getBookingRef();
        String body = buildBookingConfirmationHtml(booking);
        sendHtmlEmail(
                booking.getUser().getEmail(), subject, body);
    }

    @Async("asyncExecutor")
    @Override
    public void sendBookingCancellationEmail(Booking booking) {
        String subject = "Booking Cancelled — "
                + booking.getBookingRef();
        String body = buildCancellationHtml(booking);
        sendHtmlEmail(
                booking.getUser().getEmail(), subject, body);
    }

    private void sendHtmlEmail(String to,
                               String subject,
                               String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            mailSender.send(message);
            log.info("Email sent to: {} | Subject: {}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}",
                    to, e.getMessage());
        }
    }

    private String buildOtpEmailHtml(String title,
                                     String subtitle,
                                     String otpCode,
                                     String note) {
        return """
            <html>
            <body style="font-family:Arial,sans-serif;
                         background:#f4f4f4;padding:20px;">
              <div style="max-width:500px;margin:auto;
                          background:white;border-radius:10px;
                          padding:30px;">
                <h2 style="color:#e50914;">MovieBook</h2>
                <h3>%s</h3>
                <p>%s</p>
                <div style="background:#f8f8f8;border-radius:8px;
                            padding:20px;text-align:center;
                            margin:20px 0;">
                  <h1 style="letter-spacing:8px;color:#e50914;
                             font-size:36px;">%s</h1>
                </div>
                <p style="color:#666;font-size:13px;">%s</p>
                <hr style="border:none;border-top:1px solid #eee;">
                <p style="color:#999;font-size:11px;">
                  This is an automated email. Please do not reply.
                </p>
              </div>
            </body>
            </html>
            """.formatted(title, subtitle, otpCode, note);
    }

    private String buildBookingConfirmationHtml(Booking booking) {
        String movieTitle = booking.getShowtime()
                .getMovie().getTitle();
        String theaterName = booking.getShowtime()
                .getScreen().getTheater().getName();
        String showDate = booking.getShowtime()
                .getShowDate().toString();
        String showTime = booking.getShowtime()
                .getStartTime().toString();
        String screenName = booking.getShowtime()
                .getScreen().getScreenName();

        StringBuilder seats = new StringBuilder();
        for (BookingSeat bs : booking.getBookingSeats()) {
            seats.append("<li>")
                    .append(bs.getShowtimeSeat().getSeat().getRowLabel())
                    .append(bs.getShowtimeSeat().getSeat().getSeatNumber())
                    .append(" (")
                    .append(bs.getShowtimeSeat().getSeat()
                            .getCategory().name())
                    .append(") — ₹")
                    .append(bs.getPriceAtBooking())
                    .append("</li>");
        }

        return """
            <html>
            <body style="font-family:Arial,sans-serif;
                         background:#f4f4f4;padding:20px;">
              <div style="max-width:600px;margin:auto;
                          background:white;border-radius:10px;
                          padding:30px;">
                <h2 style="color:#e50914;">MovieBook</h2>
                <h3 style="color:#2ecc71;">
                  ✓ Booking Confirmed!</h3>
                <p>Hi %s, your booking is confirmed!</p>
                <div style="background:#f8f8f8;border-radius:8px;
                            padding:20px;margin:20px 0;">
                  <p><strong>Booking Ref:</strong> %s</p>
                  <p><strong>Movie:</strong> %s</p>
                  <p><strong>Theater:</strong> %s</p>
                  <p><strong>Screen:</strong> %s</p>
                  <p><strong>Date:</strong> %s</p>
                  <p><strong>Time:</strong> %s</p>
                  <p><strong>Seats:</strong></p>
                  <ul>%s</ul>
                  <p><strong>Total Paid:</strong>
                     ₹%.0f</p>
                </div>
                <p style="color:#666;font-size:13px;">
                  Please show your ticket QR code at the entrance.
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                booking.getUser().getName(),
                booking.getBookingRef(),
                movieTitle, theaterName, screenName,
                showDate, showTime,
                seats.toString(),
                booking.getTotalAmount());
    }

    private String buildCancellationHtml(Booking booking) {
        return """
            <html>
            <body style="font-family:Arial,sans-serif;
                         background:#f4f4f4;padding:20px;">
              <div style="max-width:500px;margin:auto;
                          background:white;border-radius:10px;
                          padding:30px;">
                <h2 style="color:#e50914;">MovieBook</h2>
                <h3>Booking Cancelled</h3>
                <p>Hi %s,</p>
                <p>Your booking <strong>%s</strong> has been
                   cancelled.</p>
                <p>Refund of <strong>₹%.0f</strong> will be
                   processed in 5-7 business days.</p>
                <p style="color:#666;font-size:13px;">
                  If you did not cancel this booking,
                  please contact support immediately.
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                booking.getUser().getName(),
                booking.getBookingRef(),
                booking.getTotalAmount());
    }
}