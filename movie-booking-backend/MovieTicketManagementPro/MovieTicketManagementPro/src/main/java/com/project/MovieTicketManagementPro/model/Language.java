package com.project.MovieTicketManagementPro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "languages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;   // Hindi

    @Column(nullable = false, unique = true)
    private String code;   // hi

    @ManyToMany(mappedBy = "languages", fetch = FetchType.LAZY)
    private List<Movie> movies;
}
