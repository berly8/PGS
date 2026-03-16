package com.pgs.dto;
import com.pgs.entity.Role;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JwtResponse {
    private String token;
    @Builder.Default private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
}
