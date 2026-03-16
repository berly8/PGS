package com.pgs.dto;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StatisticsDTO {
    private long totalStudents;
    private long totalCompanies;
    private long totalSupervisors;
    private long totalOffers;
    private long openOffers;
    private long totalApplications;
    private long pendingApplications;
    private long acceptedApplications;
    private long rejectedApplications;
    private long activeInternships;
    private long completedInternships;
}
