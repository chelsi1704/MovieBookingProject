package com.project.MovieTicketManagementPro.util;

import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class BookingRefGenerator {

    private final AtomicInteger counter = new AtomicInteger(1);

    public String generate() {
        int year = LocalDate.now().getYear();
        int count = counter.getAndIncrement();
        return String.format("BK%d%04d", year, count);
    }
}