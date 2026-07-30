package com.project.MovieTicketManagementPro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "showtime_seats",
        uniqueConstraints = @UniqueConstraint(columnNames = {"showtime_id", "seat_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // AVAILABLE → LOCKED (user selects) → BOOKED (payment done)
    // LOCKED → AVAILABLE (lock expires after 10 mins if no payment)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status = SeatStatus.AVAILABLE;

    // Price at the time of this showtime — may differ from base price (surge pricing)
    @Column(nullable = false)
    private Double price;

    // Who locked this seat — null when AVAILABLE or BOOKED
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by_user_id")
    private User lockedByUser;

    // When the lock expires — null when AVAILABLE or BOOKED
    private LocalDateTime lockExpiresAt;

    // JPA optimistic lock — if two transactions read same row and both try to update,
    // the second one gets OptimisticLockException — prevents double booking
    @Version
    private Integer version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;
}
