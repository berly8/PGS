package com.pgs.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companies")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "user_id")
public class Company extends User {

    @Column(nullable = false)
    private String companyName;

    private String industry;
    private String website;
    private String address;
    private String phone;
    private String description;
    private String logo;  // Logo file path / URL

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<InternshipOffer> offers = new ArrayList<>();
}
