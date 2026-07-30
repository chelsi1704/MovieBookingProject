package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OfferResponse>>>
    getValidOffers() {
        return ResponseEntity.ok(
                offerService.getAllValidOffers());
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<ApplyOfferResponse>>
    applyOffer(
            @Valid @RequestBody ApplyOfferRequest request) {
        return ResponseEntity.ok(
                offerService.applyOffer(request));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OfferResponse>> createOffer(
            @Valid @RequestBody CreateOfferRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(offerService.createOffer(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deactivate(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                offerService.deactivateOffer(id));
    }
}