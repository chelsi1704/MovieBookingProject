package com.project.MovieTicketManagementPro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats",
        uniqueConstraints = @UniqueConstraint(columnNames = {"screen_id","row_label","seat_number"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Row letter — A, B, C, D...
    @Column(nullable = false)
    private String rowLabel;

    // Seat number within the row — 1, 2, 3...
    @Column(nullable = false)
    private Integer seatNumber;

    // Determines the price tier
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatCategory category;

    // Disabled seats can be hidden from the booking UI
    @Column(nullable = false)
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
}
