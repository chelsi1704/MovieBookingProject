package com.project.MovieTicketManagementPro.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid Indian mobile number")
    private String phone;

    // Optional — URL of uploaded profile picture
    private String avatarUrl;
}
