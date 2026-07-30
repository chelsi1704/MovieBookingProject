package com.project.MovieTicketManagementPro.util;

import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class TicketCodeGenerator {

    public String generate() {
        String uuid = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .toUpperCase()
                .substring(0, 8);
        return "TK-" + uuid;
    }
    public String generate(String bookingRef, String rowLabel,
                           Integer seatNumber) {
        return "TK-" + bookingRef + "-" + rowLabel + seatNumber;
    }
}
