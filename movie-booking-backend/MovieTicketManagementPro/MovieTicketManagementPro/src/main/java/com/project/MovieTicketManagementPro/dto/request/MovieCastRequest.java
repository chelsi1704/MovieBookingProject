package com.project.MovieTicketManagementPro.dto.request;

import com.project.MovieTicketManagementPro.model.CastRoleType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieCastRequest {

    @NotNull(message = "Person ID is required")
    private Long personId;

    @NotNull(message = "Role type is required")
    private CastRoleType roleType;

    private String characterName;

    private Integer billingOrder;
}
