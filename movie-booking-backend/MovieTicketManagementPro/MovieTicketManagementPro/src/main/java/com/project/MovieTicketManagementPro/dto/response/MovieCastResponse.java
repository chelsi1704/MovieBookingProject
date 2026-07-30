package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieCastResponse {

    private Long personId;
    private String personName;
    private String photoUrl;
    private String roleType;
    private String characterName;
    private Integer billingOrder;

}
