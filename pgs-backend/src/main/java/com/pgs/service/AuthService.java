package com.pgs.service;

import com.pgs.dto.JwtResponse;
import com.pgs.dto.LoginRequest;
import com.pgs.dto.RegisterRequest;
import com.pgs.entity.*;
import com.pgs.exception.BadRequestException;
import com.pgs.repository.*;
import com.pgs.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final SupervisorRepository supervisorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        return JwtResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use: " + request.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User savedUser = switch (request.getRole()) {
            case STUDENT -> {
                Student student = Student.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(encodedPassword)
                        .role(Role.STUDENT)
                        .studentNumber(request.getStudentNumber())
                        .program(request.getProgram())
                        .build();
                yield studentRepository.save(student);
            }
            case COMPANY -> {
                if (request.getCompanyName() == null || request.getCompanyName().isBlank()) {
                    throw new BadRequestException("Company name is required for company registration");
                }
                Company company = Company.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(encodedPassword)
                        .role(Role.COMPANY)
                        .companyName(request.getCompanyName())
                        .build();
                yield companyRepository.save(company);
            }
            case SUPERVISOR -> {
                Supervisor supervisor = Supervisor.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(encodedPassword)
                        .role(Role.SUPERVISOR)
                        .department(request.getDepartment())
                        .build();
                yield supervisorRepository.save(supervisor);
            }
            case ADMIN -> {
                User admin = User.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(encodedPassword)
                        .role(Role.ADMIN)
                        .build();
                yield userRepository.save(admin);
            }
        };

        String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail());
        return JwtResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .build();
    }
}
