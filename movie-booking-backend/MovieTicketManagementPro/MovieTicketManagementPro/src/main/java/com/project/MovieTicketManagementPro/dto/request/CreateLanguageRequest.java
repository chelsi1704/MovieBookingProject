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
public class CreateLanguageRequest {

    @NotBlank(message = "Language name is required")
    @Size(max = 50)
    private String name;

    @NotBlank(message = "Language code is required")
    @Size(min = 2, max = 5)
    private String code;
}
