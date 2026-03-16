package com.pgs.repository;

import com.pgs.entity.InternshipOffer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {
    List<InternshipOffer> findByCompanyId(Long companyId);
    List<InternshipOffer> findByStatus(InternshipOffer.OfferStatus status);

    @Query("SELECT o FROM InternshipOffer o WHERE o.status = 'OPEN' AND " +
           "(:domain IS NULL OR o.domain LIKE %:domain%) AND " +
           "(:location IS NULL OR o.location LIKE %:location%)")
    Page<InternshipOffer> searchOffers(
        @Param("domain") String domain,
        @Param("location") String location,
        Pageable pageable
    );

    long countByStatus(InternshipOffer.OfferStatus status);
}
