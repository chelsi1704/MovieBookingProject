package com.project.MovieTicketManagementPro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookedSeatResponse {

    private Long bookingSeatId;
    private String rowLabel;
    private Integer seatNumber;
    private String category;
    private Double priceAtBooking;
}
