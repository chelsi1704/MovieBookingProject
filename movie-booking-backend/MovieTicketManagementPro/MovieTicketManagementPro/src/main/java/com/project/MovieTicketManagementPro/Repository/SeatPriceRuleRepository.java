package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.ScreenType;
import com.project.MovieTicketManagementPro.model.SeatCategory;
import com.project.MovieTicketManagementPro.model.SeatPriceRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatPriceRuleRepository extends JpaRepository<SeatPriceRule, Long> {

    Optional<SeatPriceRule> findByTheaterIdAndSeatCategoryAndScreenType(
            Long theaterId,
            SeatCategory seatCategory,
            ScreenType screenType
    );

    List<SeatPriceRule> findByTheaterId(Long theaterId);
}
