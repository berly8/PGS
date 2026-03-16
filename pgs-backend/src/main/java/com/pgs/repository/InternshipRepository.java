package com.pgs.repository;

import com.pgs.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findBySupervisorId(Long supervisorId);
    Optional<Internship> findByApplicationId(Long applicationId);
    Optional<Internship> findByApplicationStudentId(Long studentId);
    long countByStatus(Internship.InternshipStatus status);
}
