package com.pgs.repository;

import com.pgs.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByOfferId(Long offerId);
    Optional<Application> findByStudentIdAndOfferId(Long studentId, Long offerId);
    boolean existsByStudentIdAndOfferId(Long studentId, Long offerId);
    List<Application> findByOfferCompanyId(Long companyId);
    long countByStatus(Application.ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.offer.company.id = :companyId")
    long countByCompanyId(Long companyId);
}
