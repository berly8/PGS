package com.pgs.service;

import com.pgs.dto.InternshipDTO;
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
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final SupervisorRepository supervisorRepository;

    public List<InternshipDTO> getAllInternships() {
        return internshipRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<InternshipDTO> getInternshipsBySupervisor(Long supervisorId) {
        return internshipRepository.findBySupervisorId(supervisorId).stream().map(this::toDTO).toList();
    }

    public InternshipDTO getInternshipByStudent(Long studentId) {
        return internshipRepository.findByApplicationStudentId(studentId)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("No active internship found for student"));
    }

    public InternshipDTO getInternshipById(Long id) {
        return toDTO(internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", id)));
    }

    @Transactional
    public InternshipDTO createInternship(Long applicationId, Long supervisorId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        if (application.getStatus() != Application.ApplicationStatus.ACCEPTED) {
            throw new BadRequestException("Only accepted applications can be converted to internships");
        }

        if (internshipRepository.findByApplicationId(applicationId).isPresent()) {
            throw new BadRequestException("An internship already exists for this application");
        }

        Supervisor supervisor = supervisorId != null
                ? supervisorRepository.findById(supervisorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Supervisor", supervisorId))
                : null;

        Internship internship = Internship.builder()
                .application(application)
                .supervisor(supervisor)
                .startDate(application.getOffer().getStartDate())
                .endDate(application.getOffer().getEndDate())
                .build();

        return toDTO(internshipRepository.save(internship));
    }

    @Transactional
    public InternshipDTO updateInternship(Long id, InternshipDTO dto) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", id));

        if (dto.getSupervisorId() != null) {
            Supervisor supervisor = supervisorRepository.findById(dto.getSupervisorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supervisor", dto.getSupervisorId()));
            internship.setSupervisor(supervisor);
        }
        if (dto.getStartDate() != null) internship.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) internship.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) internship.setStatus(dto.getStatus());
        if (dto.getSupervisorReport() != null) internship.setSupervisorReport(dto.getSupervisorReport());
        if (dto.getGrade() != null) internship.setGrade(dto.getGrade());
        if (dto.getObjectives() != null) internship.setObjectives(dto.getObjectives());
        if (dto.getAchievements() != null) internship.setAchievements(dto.getAchievements());

        return toDTO(internshipRepository.save(internship));
    }

    public InternshipDTO toDTO(Internship i) {
        Application app = i.getApplication();
        return InternshipDTO.builder()
                .id(i.getId())
                .applicationId(app.getId())
                .studentName(app.getStudent().getFullName())
                .studentEmail(app.getStudent().getEmail())
                .offerTitle(app.getOffer().getTitle())
                .companyName(app.getOffer().getCompany().getCompanyName())
                .supervisorId(i.getSupervisor() != null ? i.getSupervisor().getId() : null)
                .supervisorName(i.getSupervisor() != null ? i.getSupervisor().getFullName() : null)
                .startDate(i.getStartDate())
                .endDate(i.getEndDate())
                .status(i.getStatus())
                .supervisorReport(i.getSupervisorReport())
                .grade(i.getGrade())
                .objectives(i.getObjectives())
                .achievements(i.getAchievements())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
