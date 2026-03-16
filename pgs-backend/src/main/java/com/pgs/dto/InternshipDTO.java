package com.pgs.dto;
import com.pgs.entity.Internship;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InternshipDTO {
    private Long id;
    private Long applicationId;
    private String studentName;
    private String studentEmail;
    private String offerTitle;
    private String companyName;
    private Long supervisorId;
    private String supervisorName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Internship.InternshipStatus status;
    private String supervisorReport;
    private Double grade;
    private String objectives;
    private String achievements;
    private LocalDateTime createdAt;
}
