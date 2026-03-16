package com.pgs.controller;

import com.pgs.dto.ApplicationDTO;
import com.pgs.entity.Application;
import com.pgs.entity.User;
import com.pgs.repository.UserRepository;
import com.pgs.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyApplications(@AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(user.getId()));
    }

    @GetMapping("/offer/{offerId}")
    @PreAuthorize("hasAnyRole('COMPANY','ADMIN')")
    public ResponseEntity<?> getByOffer(@PathVariable Long offerId) {
        return ResponseEntity.ok(applicationService.getApplicationsByOffer(offerId));
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getCompanyApplications(@AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(applicationService.getApplicationsByCompany(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PostMapping("/apply/{offerId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationDTO> apply(
            @PathVariable Long offerId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(applicationService.applyToOffer(
                user.getId(), offerId, body.get("coverLetter"), body.get("cvUrl")));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('COMPANY','ADMIN')")
    public ResponseEntity<ApplicationDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        boolean isCompany = ud.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COMPANY"));
        return ResponseEntity.ok(applicationService.updateStatus(
                id, Application.ApplicationStatus.valueOf(body.get("status")),
                body.get("note"), isCompany));
    }

    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> withdraw(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        applicationService.withdrawApplication(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
