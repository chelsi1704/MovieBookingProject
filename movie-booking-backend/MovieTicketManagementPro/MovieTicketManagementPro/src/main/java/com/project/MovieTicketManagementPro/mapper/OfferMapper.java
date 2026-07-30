package com.project.MovieTicketManagementPro.mapper;

import com.project.MovieTicketManagementPro.dto.response.ApplyOfferResponse;
import com.project.MovieTicketManagementPro.dto.response.OfferResponse;
import com.project.MovieTicketManagementPro.model.Offer;
import org.springframework.stereotype.Component;

@Component
public class OfferMapper {

    public OfferResponse toResponse(Offer offer) {
        Integer remaining = offer.getMaxUses() != null
                ? offer.getMaxUses() - offer.getUsedCount()
                : null;

        return OfferResponse.builder()
                .id(offer.getId())
                .code(offer.getCode())
                .description(offer.getDescription())
                .type(offer.getType().name())
                .discountValue(offer.getDiscountValue())
                .minOrderAmount(offer.getMinOrderAmount())
                .maxDiscount(offer.getMaxDiscount())
                .maxUses(offer.getMaxUses())
                .usedCount(offer.getUsedCount())
                .remainingUses(remaining)
                .validFrom(offer.getValidFrom())
                .validUntil(offer.getValidUntil())
                .isActive(offer.isActive())
                .build();
    }

    public ApplyOfferResponse toApplyResponse(
            Offer offer,
            Double originalAmount,
            double discountAmount,
            double finalAmount) {

        return ApplyOfferResponse.builder()
                .offerCode(offer.getCode())
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .build();
    }
}