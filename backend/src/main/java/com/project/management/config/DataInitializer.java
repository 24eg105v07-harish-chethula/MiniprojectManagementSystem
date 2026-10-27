package com.project.management.config;

import com.project.management.entity.Project;
import com.project.management.entity.ProjectStatus;
import com.project.management.entity.Role;
import com.project.management.entity.User;
import com.project.management.repository.ProjectRepository;
import com.project.management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.fullname:System Administrator}")
    private String adminFullName;

    @Value("${app.admin.email:admin@project.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Initialize Admin
        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElseGet(() -> {
            logger.info("Initializing default administrator account: {}", adminEmail);
            User newAdmin = new User();
            newAdmin.setFullName(adminFullName);
            newAdmin.setEmail(adminEmail.toLowerCase());
            newAdmin.setPassword(passwordEncoder.encode(adminPassword));
            newAdmin.setRole(Role.ROLE_ADMIN);
            newAdmin.setCreatedAt(LocalDateTime.now());
            return userRepository.save(newAdmin);
        });

        // 2. Initialize Standard Test User
        String standardUserEmail = "user@project.com";
        User standardUser = userRepository.findByEmail(standardUserEmail).orElseGet(() -> {
            logger.info("Initializing standard user account: {}", standardUserEmail);
            User newUser = new User();
            newUser.setFullName("Harish User");
            newUser.setEmail(standardUserEmail);
            newUser.setPassword(passwordEncoder.encode("User@123"));
            newUser.setRole(Role.ROLE_USER);
            newUser.setCreatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });

        // 3. Initialize Demo Projects if none exist
        if (projectRepository.count() == 0) {
            logger.info("Seeding demo projects...");
            LocalDate today = LocalDate.now();

            Project p1 = new Project(
                    null,
                    "Cloud Infrastructure Migration",
                    "Migrate core database services to high availability clusters with multi-region failover and automated backups.",
                    today.minusDays(5),
                    today.plusDays(25),
                    ProjectStatus.IN_PROGRESS,
                    admin,
                    LocalDateTime.now().minusDays(5)
            );

            Project p2 = new Project(
                    null,
                    "Mobile App UI Redesign",
                    "Redesign iOS and Android dashboard interfaces to match the new 2026 design system and accessibility WCAG AA guidelines.",
                    today.minusDays(10),
                    today.plusDays(15),
                    ProjectStatus.NOT_STARTED,
                    standardUser,
                    LocalDateTime.now().minusDays(3)
            );

            Project p3 = new Project(
                    null,
                    "Payment Gateway Integration",
                    "Integrate Stripe and PayPal webhooks with idempotency keys and end-to-end receipt generation.",
                    today.minusDays(20),
                    today.minusDays(2),
                    ProjectStatus.COMPLETED,
                    standardUser,
                    LocalDateTime.now().minusDays(18)
            );

            Project p4 = new Project(
                    null,
                    "Security Audit & Penetration Testing",
                    "Comprehensive review of API endpoints, rate limiting, token expiration, and SQL injection protections.",
                    today,
                    today.plusDays(40),
                    ProjectStatus.NOT_STARTED,
                    admin,
                    LocalDateTime.now()
            );

            projectRepository.save(p1);
            projectRepository.save(p2);
            projectRepository.save(p3);
            projectRepository.save(p4);
            logger.info("Demo projects seeded successfully.");
        }
    }
}
