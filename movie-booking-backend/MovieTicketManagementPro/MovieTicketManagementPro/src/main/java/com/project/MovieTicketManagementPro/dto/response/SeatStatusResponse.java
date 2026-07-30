package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatStatusResponse {

    private Long showtimeSeatId;
    private String rowLabel;
    private Integer seatNumber;
    private String category;
    private String status;
    private Double price;
    private boolean isLockedByMe;
}
