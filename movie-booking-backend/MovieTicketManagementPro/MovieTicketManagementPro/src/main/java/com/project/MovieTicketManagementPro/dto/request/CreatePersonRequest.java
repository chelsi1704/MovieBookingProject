package com.project.MovieTicketManagementPro.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePersonRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String bio;
    private String photoUrl;
    private LocalDate birthDate;
    private String nationality;
}
