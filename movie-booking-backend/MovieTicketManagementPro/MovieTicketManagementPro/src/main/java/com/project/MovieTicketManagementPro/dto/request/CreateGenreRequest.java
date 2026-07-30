package com.project.MovieTicketManagementPro.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGenreRequest {

    @NotBlank(message = "Genre name is required")
    @Size(max = 50)
    private String name;
}
