package com.pgs.service;

import com.pgs.dto.StatisticsDTO;
import com.pgs.dto.UserDTO;
import com.pgs.entity.*;
import com.pgs.exception.ResourceNotFoundException;
import com.pgs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final SupervisorRepository supervisorRepository;
    private final InternshipOfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    public UserDTO getUserById(Long id) {
        return toDTO(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }

    @Transactional
    public UserDTO toggleUserEnabled(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setEnabled(!user.isEnabled());
        return toDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        userRepository.delete(user);
    }

    public StatisticsDTO getStatistics() {
        return StatisticsDTO.builder()
                .totalStudents(studentRepository.count())
                .totalCompanies(companyRepository.count())
                .totalSupervisors(supervisorRepository.count())
                .totalOffers(offerRepository.count())
                .openOffers(offerRepository.countByStatus(InternshipOffer.OfferStatus.OPEN))
                .totalApplications(applicationRepository.count())
                .pendingApplications(applicationRepository.countByStatus(Application.ApplicationStatus.PENDING))
                .acceptedApplications(applicationRepository.countByStatus(Application.ApplicationStatus.ACCEPTED))
                .rejectedApplications(applicationRepository.countByStatus(Application.ApplicationStatus.REJECTED))
                .activeInternships(internshipRepository.countByStatus(Internship.InternshipStatus.ACTIVE))
                .completedInternships(internshipRepository.countByStatus(Internship.InternshipStatus.COMPLETED))
                .build();
    }

    public UserDTO toDTO(User user) {
        UserDTO.UserDTOBuilder builder = UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt());

        if (user instanceof Student s) {
            builder.studentNumber(s.getStudentNumber()).program(s.getProgram());
        } else if (user instanceof Company c) {
            builder.companyName(c.getCompanyName());
        } else if (user instanceof Supervisor s) {
            builder.department(s.getDepartment());
        }

        return builder.build();
    }
}
