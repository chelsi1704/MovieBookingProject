package com.project.MovieTicketManagementPro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "movie_cast")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieCast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Actor, Director, Producer, or Writer
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CastRoleType roleType;

    // Character name for actors e.g. "Raj" — null for directors/producers
    private String characterName;

    // Order in which cast is displayed — 1 = lead actor
    private Integer billingOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;
}
