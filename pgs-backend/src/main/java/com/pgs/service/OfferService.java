package com.pgs.service;

import com.pgs.dto.OfferDTO;
import com.pgs.entity.Company;
import com.pgs.entity.InternshipOffer;
import com.pgs.exception.BadRequestException;
import com.pgs.exception.ResourceNotFoundException;
import com.pgs.repository.ApplicationRepository;
import com.pgs.repository.CompanyRepository;
import com.pgs.repository.InternshipOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final InternshipOfferRepository offerRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    public Page<OfferDTO> searchOffers(String domain, String location, Pageable pageable) {
        return offerRepository.searchOffers(domain, location, pageable).map(this::toDTO);
    }

    public List<OfferDTO> getOffersByCompany(Long companyId) {
        return offerRepository.findByCompanyId(companyId).stream().map(this::toDTO).toList();
    }

    public OfferDTO getOfferById(Long id) {
        return toDTO(offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", id)));
    }

    @Transactional
    public OfferDTO createOffer(OfferDTO dto, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", companyId));

        InternshipOffer offer = InternshipOffer.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .domain(dto.getDomain())
                .durationWeeks(dto.getDurationWeeks())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .compensation(dto.getCompensation())
                .requirements(dto.getRequirements())
                .company(company)
                .build();

        return toDTO(offerRepository.save(offer));
    }

    @Transactional
    public OfferDTO updateOffer(Long id, OfferDTO dto, Long companyId) {
        InternshipOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", id));

        if (!offer.getCompany().getId().equals(companyId)) {
            throw new BadRequestException("You can only update your own offers");
        }

        offer.setTitle(dto.getTitle());
        offer.setDescription(dto.getDescription());
        offer.setLocation(dto.getLocation());
        offer.setDomain(dto.getDomain());
        offer.setDurationWeeks(dto.getDurationWeeks());
        offer.setStartDate(dto.getStartDate());
        offer.setEndDate(dto.getEndDate());
        offer.setCompensation(dto.getCompensation());
        offer.setRequirements(dto.getRequirements());
        if (dto.getStatus() != null) offer.setStatus(dto.getStatus());

        return toDTO(offerRepository.save(offer));
    }

    @Transactional
    public void deleteOffer(Long id, Long companyId) {
        InternshipOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", id));
        if (!offer.getCompany().getId().equals(companyId)) {
            throw new BadRequestException("You can only delete your own offers");
        }
        offerRepository.delete(offer);
    }

    public OfferDTO toDTO(InternshipOffer offer) {
        return OfferDTO.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .description(offer.getDescription())
                .location(offer.getLocation())
                .domain(offer.getDomain())
                .durationWeeks(offer.getDurationWeeks())
                .startDate(offer.getStartDate())
                .endDate(offer.getEndDate())
                .compensation(offer.getCompensation())
                .requirements(offer.getRequirements())
                .status(offer.getStatus())
                .companyId(offer.getCompany().getId())
                .companyName(offer.getCompany().getCompanyName())
                .companyLogo(offer.getCompany().getLogo())
                .createdAt(offer.getCreatedAt())
                .applicationCount(offer.getApplications().size())
                .build();
    }
}
