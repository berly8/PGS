package com.pgs.controller;

import com.pgs.dto.OfferDTO;
import com.pgs.entity.User;
import com.pgs.repository.UserRepository;
import com.pgs.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<OfferDTO>> searchOffers(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String location,
            Pageable pageable) {
        return ResponseEntity.ok(offerService.searchOffers(domain, location, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferDTO> getOffer(@PathVariable Long id) {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getOffersByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(offerService.getOffersByCompany(companyId));
    }

    @PostMapping
    public ResponseEntity<OfferDTO> createOffer(@RequestBody OfferDTO dto,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(offerService.createOffer(dto, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferDTO> updateOffer(@PathVariable Long id, @RequestBody OfferDTO dto,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(offerService.updateOffer(id, dto, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        offerService.deleteOffer(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
