package com.project.MovieTicketManagementPro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique code embedded in QR — e.g. TK-A1-BK20250001
    @Column(nullable = false, unique = true)
    private String ticketCode;

    // URL to the generated QR code image stored in cloud storage
    private String qrUrl;

    @Column(nullable = false)
    private boolean isScanned = false;

    private LocalDateTime scannedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // Tells exactly which seat this ticket is for
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_seat_id", nullable = false)
    private BookingSeat bookingSeat;
}
