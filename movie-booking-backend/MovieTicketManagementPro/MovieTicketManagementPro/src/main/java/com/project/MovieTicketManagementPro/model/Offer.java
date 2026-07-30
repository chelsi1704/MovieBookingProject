package com.project.MovieTicketManagementPro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // What the user types at checkout — e.g. FIRST100
    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferType type;

    @Column(nullable = false)
    private Double discountValue;

    // Coupon only applies if cart total >= this amount
    private Double minOrderAmount;

    // For PERCENT type — caps the discount so 50% off doesn't give Rs.5000 off
    private Double maxDiscount;

    // Total times this coupon can be used across all users
    private Integer maxUses;

    // Incremented every time the coupon is successfully applied
    @Column(nullable = false)
    private Integer usedCount = 0;

    @Column(nullable = false)
    private LocalDate validFrom;

    @Column(nullable = false)
    private LocalDate validUntil;

    @Column(nullable = false)
    private boolean isActive = true;
}
