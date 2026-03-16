package com.pgs.dto;
import com.pgs.entity.InternshipOffer;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OfferDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String domain;
    private Integer durationWeeks;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double compensation;
    private String requirements;
    private InternshipOffer.OfferStatus status;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private LocalDateTime createdAt;
    private int applicationCount;
}
