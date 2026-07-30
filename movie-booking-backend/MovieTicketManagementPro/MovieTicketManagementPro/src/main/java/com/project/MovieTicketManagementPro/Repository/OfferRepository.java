package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    Optional<Offer> findByCodeIgnoreCaseAndIsActive(String code, boolean isActive);

    @Query("""
        SELECT o FROM Offer o
        WHERE o.isActive = true
        AND o.validFrom <= :today
        AND o.validUntil >= :today
        AND (o.maxUses IS NULL OR o.usedCount < o.maxUses)
        ORDER BY o.discountValue DESC
        """)
    List<Offer> findAllValidOffers(@Param("today") LocalDate today);

    boolean existsByCodeIgnoreCase(String code);
}
