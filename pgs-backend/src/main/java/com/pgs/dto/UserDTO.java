package com.pgs.dto;
import com.pgs.entity.Role;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private String companyName;
    private String studentNumber;
    private String program;
    private String department;
}
