package com.pgs.controller;

import com.pgs.dto.InternshipDTO;
import com.pgs.entity.User;
import com.pgs.repository.UserRepository;
import com.pgs.service.InternshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
public class InternshipController {

    private final InternshipService internshipService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<?> getMySupervisedInternships(@AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(internshipService.getInternshipsBySupervisor(user.getId()));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<InternshipDTO> getStudentInternship(@AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(internshipService.getInternshipByStudent(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }

    @PostMapping("/create/{applicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InternshipDTO> create(
            @PathVariable Long applicationId,
            @RequestParam(required = false) Long supervisorId) {
        return ResponseEntity.ok(internshipService.createInternship(applicationId, supervisorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR')")
    public ResponseEntity<InternshipDTO> update(@PathVariable Long id, @RequestBody InternshipDTO dto) {
        return ResponseEntity.ok(internshipService.updateInternship(id, dto));
    }
}
