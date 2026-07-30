package com.project.MovieTicketManagementPro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // What happened — BOOKING_CREATED, PAYMENT_SUCCESS, SEAT_LOCKED etc.
    @Column(nullable = false)
    private String action;

    // Which entity type was affected — "Booking", "Payment", "User"
    private String entityType;

    // The ID of the affected entity
    private Long entityId;

    // User's IP address — useful for fraud detection
    private String ipAddress;

    // Extra context stored as JSON string — flexible, no fixed schema
    @Column(columnDefinition = "TEXT")
    private String metadata;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // Nullable — some events are system-generated with no user context
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
