package com.pgs.dto;
import com.pgs.entity.Application;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApplicationDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long offerId;
    private String offerTitle;
    private String companyName;
    private String coverLetter;
    private String cvUrl;
    private Application.ApplicationStatus status;
    private String companyNote;
    private String adminNote;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
