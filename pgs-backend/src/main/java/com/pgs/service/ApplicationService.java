package com.pgs.service;

import com.pgs.dto.ApplicationDTO;
import com.pgs.entity.*;
import com.pgs.exception.BadRequestException;
import com.pgs.exception.ResourceNotFoundException;
import com.pgs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final InternshipOfferRepository offerRepository;

    public List<ApplicationDTO> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream().map(this::toDTO).toList();
    }

    public List<ApplicationDTO> getApplicationsByOffer(Long offerId) {
        return applicationRepository.findByOfferId(offerId).stream().map(this::toDTO).toList();
    }

    public List<ApplicationDTO> getApplicationsByCompany(Long companyId) {
        return applicationRepository.findByOfferCompanyId(companyId).stream().map(this::toDTO).toList();
    }

    public List<ApplicationDTO> getAllApplications() {
        return applicationRepository.findAll().stream().map(this::toDTO).toList();
    }

    public ApplicationDTO getApplicationById(Long id) {
        return toDTO(applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id)));
    }

    @Transactional
    public ApplicationDTO applyToOffer(Long studentId, Long offerId, String coverLetter, String cvUrl) {
        if (applicationRepository.existsByStudentIdAndOfferId(studentId, offerId)) {
            throw new BadRequestException("You have already applied to this offer");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));
        InternshipOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", offerId));

        if (offer.getStatus() != InternshipOffer.OfferStatus.OPEN) {
            throw new BadRequestException("This offer is no longer accepting applications");
        }

        Application application = Application.builder()
                .student(student)
                .offer(offer)
                .coverLetter(coverLetter)
                .cvUrl(cvUrl)
                .build();

        return toDTO(applicationRepository.save(application));
    }

    @Transactional
    public ApplicationDTO updateStatus(Long id, Application.ApplicationStatus newStatus,
                                       String note, boolean isCompany) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        application.setStatus(newStatus);
        if (isCompany) {
            application.setCompanyNote(note);
        } else {
            application.setAdminNote(note);
        }

        return toDTO(applicationRepository.save(application));
    }

    @Transactional
    public void withdrawApplication(Long applicationId, Long studentId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        if (!application.getStudent().getId().equals(studentId)) {
            throw new BadRequestException("You can only withdraw your own applications");
        }

        application.setStatus(Application.ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);
    }

    public ApplicationDTO toDTO(Application app) {
        return ApplicationDTO.builder()
                .id(app.getId())
                .studentId(app.getStudent().getId())
                .studentName(app.getStudent().getFullName())
                .studentEmail(app.getStudent().getEmail())
                .offerId(app.getOffer().getId())
                .offerTitle(app.getOffer().getTitle())
                .companyName(app.getOffer().getCompany().getCompanyName())
                .coverLetter(app.getCoverLetter())
                .cvUrl(app.getCvUrl())
                .status(app.getStatus())
                .companyNote(app.getCompanyNote())
                .adminNote(app.getAdminNote())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
