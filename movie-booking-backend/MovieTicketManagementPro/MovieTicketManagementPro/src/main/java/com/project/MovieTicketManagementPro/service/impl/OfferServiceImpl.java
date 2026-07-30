package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.OfferRepository;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.mapper.OfferMapper;
import com.project.MovieTicketManagementPro.model.Offer;
import com.project.MovieTicketManagementPro.model.OfferType;
import com.project.MovieTicketManagementPro.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;
    private final OfferMapper offerMapper;

    @Override
    public ApiResponse<OfferResponse> createOffer(
            CreateOfferRequest request) {

        if (offerRepository.existsByCodeIgnoreCase(
                request.getCode())) {
            throw new DuplicateResourceException(
                    "Offer", "code", request.getCode());
        }

        Offer offer = Offer.builder()
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .type(request.getType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxDiscount(request.getMaxDiscount())
                .maxUses(request.getMaxUses())
                .usedCount(0)
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .isActive(true)
                .build();

        Offer saved = offerRepository.save(offer);
        return ApiResponse.success(
                "Offer created successfully.",
                offerMapper.toResponse(saved));
    }
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<OfferResponse>> getAllValidOffers() {
        List<OfferResponse> offers = offerRepository
                .findAllValidOffers(LocalDate.now())
                .stream()
                .map(offerMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Offers fetched.", offers);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<ApplyOfferResponse> applyOffer(
            ApplyOfferRequest request) {

        Offer offer = offerRepository
                .findByCodeIgnoreCaseAndIsActive(
                        request.getCode(), true)
                .orElseThrow(() -> new OfferNotFoundException(
                        request.getCode()));

        LocalDate today = LocalDate.now();
        if (today.isAfter(offer.getValidUntil())) {
            throw new OfferExpiredException(request.getCode());
        }

        if (offer.getMaxUses() != null
                && offer.getUsedCount() >= offer.getMaxUses()) {
            throw new OfferUsageLimitReachedException(
                    request.getCode());
        }

        if (offer.getMinOrderAmount() != null
                && request.getOrderAmount()
                < offer.getMinOrderAmount()) {
            throw new IllegalArgumentException(
                    "Minimum order amount for this offer is ₹"
                            + offer.getMinOrderAmount());
        }

        double discount = calculateDiscount(
                offer, request.getOrderAmount());
        double finalAmount = request.getOrderAmount() - discount;

        return ApiResponse.success(
                "Offer applied successfully!",
                offerMapper.toApplyResponse(
                        offer,
                        request.getOrderAmount(),
                        discount,
                        finalAmount));
    }

    @Override
    public ApiResponse<String> deactivateOffer(Long offerId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Offer", "id", offerId));
        offer.setActive(false);
        offerRepository.save(offer);
        return ApiResponse.success(
                "Offer deactivated successfully.", null);
    }

    private double calculateDiscount(Offer offer, Double amount) {
        return switch (offer.getType()) {
            case FLAT -> Math.min(
                    offer.getDiscountValue(), amount);
            case PERCENT -> {
                double pct = (offer.getDiscountValue() / 100) * amount;
                yield offer.getMaxDiscount() != null
                        ? Math.min(pct, offer.getMaxDiscount())
                        : pct;
            }
            case CASHBACK -> offer.getDiscountValue();
        };
    }
}