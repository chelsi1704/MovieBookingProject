package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import java.util.List;

public interface OfferService {
    ApiResponse<OfferResponse> createOffer(CreateOfferRequest request);

    ApiResponse<List<OfferResponse>> getAllValidOffers();

    ApiResponse<ApplyOfferResponse> applyOffer(
            ApplyOfferRequest request);

    ApiResponse<String> deactivateOffer(Long offerId);
}
