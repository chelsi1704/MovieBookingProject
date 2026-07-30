package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.SeatMapResponse;
import com.project.MovieTicketManagementPro.dto.response.SeatStatusResponse;
import com.project.MovieTicketManagementPro.dto.response.ShowtimeResponse;
import com.project.MovieTicketManagementPro.model.*;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Component
public class ShowtimeMapper {

    public ShowtimeResponse toResponse(Showtime showtime,
                                       Double minPrice,
                                       Double maxPrice) {
        Screen screen = showtime.getScreen();
        Theater theater = screen.getTheater();
        Movie movie = showtime.getMovie();

        return ShowtimeResponse.builder()
                .id(showtime.getId())
                .showDate(showtime.getShowDate())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .status(showtime.getStatus().name())
                .availableSeats(showtime.getAvailableSeats())
                .totalSeats(screen.getTotalSeats())
                .movieId(movie.getId())
                .movieTitle(movie.getTitle())
                .moviePoster(movie.getPosterUrl())
                .theaterId(theater.getId())
                .theaterName(theater.getName())
                .theaterAddress(theater.getAddress())
                .screenId(screen.getId())
                .screenName(screen.getScreenName())
                .screenType(screen.getScreenType().name())
                .language(showtime.getLanguage().getName())
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .build();
    }
      public SeatMapResponse toSeatMapResponse(Showtime showtime,
                                             List<ShowtimeSeat> showtimeSeats,
                                             Long currentUserId) {
        Screen screen = showtime.getScreen();
        Movie movie = showtime.getMovie();

        // Group all ShowtimeSeat records by their physical seat's row label
        // Result: { "A" -> [seat1, seat2...], "B" -> [...] }
        Map<String, List<SeatStatusResponse>> seatsByRow = showtimeSeats.stream()
                .collect(Collectors.groupingBy(
                        ss -> ss.getSeat().getRowLabel(),
                        TreeMap::new,          // TreeMap keeps rows in A-B-C order
                        Collectors.mapping(
                                ss -> toSeatStatusResponse(ss, currentUserId),
                                Collectors.toList()
                        )
                ));


        seatsByRow.forEach((row, seats) ->
                seats.sort(Comparator.comparingInt(SeatStatusResponse::getSeatNumber))
        );

        long available = showtimeSeats.stream()
                .filter(ss -> ss.getStatus() == SeatStatus.AVAILABLE).count();
        long locked = showtimeSeats.stream()
                .filter(ss -> ss.getStatus() == SeatStatus.LOCKED).count();
        long booked = showtimeSeats.stream()
                .filter(ss -> ss.getStatus() == SeatStatus.BOOKED).count();

        return SeatMapResponse.builder()
                .showtimeId(showtime.getId())
                .movieTitle(movie.getTitle())
                .showDate(showtime.getShowDate())
                .startTime(showtime.getStartTime())
                .screenName(screen.getScreenName())
                .screenType(screen.getScreenType().name())
                .seatsByRow(seatsByRow)
                .totalSeats(screen.getTotalSeats())
                .availableSeats((int) available)
                .lockedSeats((int) locked)
                .bookedSeats((int) booked)
                .build();
    }

    public SeatStatusResponse toSeatStatusResponse(ShowtimeSeat ss,
                                                   Long currentUserId) {

        boolean isLockedByMe = ss.getLockedByUser() != null
                && ss.getLockedByUser().getId().equals(currentUserId);

        return SeatStatusResponse.builder()
                .showtimeSeatId(ss.getId())
                .rowLabel(ss.getSeat().getRowLabel())
                .seatNumber(ss.getSeat().getSeatNumber())
                .category(ss.getSeat().getCategory().name())
                .status(ss.getStatus().name())
                .price(ss.getPrice())
                .isLockedByMe(isLockedByMe)
                .build();
    }
}
