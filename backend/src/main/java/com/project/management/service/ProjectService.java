package com.project.management.service;

import com.project.management.dto.ProjectRequest;
import com.project.management.dto.ProjectResponse;
import com.project.management.dto.StatsResponse;
import com.project.management.dto.StatusUpdateRequest;
import com.project.management.entity.Project;
import com.project.management.entity.ProjectStatus;
import com.project.management.entity.Role;
import com.project.management.entity.User;
import com.project.management.exception.BadRequestException;
import com.project.management.exception.ResourceNotFoundException;
import com.project.management.exception.UnauthorizedException;
import com.project.management.repository.ProjectRepository;
import com.project.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private void validateDates(ProjectRequest request) {
        if (request.getDeadline().isBefore(request.getStartDate())) {
            throw new BadRequestException("Deadline cannot be earlier than the start date");
        }
    }

    private void checkManagementPermission(Project project, User user) {
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = project.getCreatedBy() != null && project.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("Permission denied: You can only modify your own projects");
        }
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String userEmail) {
        validateDates(request);
        User user = getAuthenticatedUser(userEmail);

        Project project = new Project();
        project.setName(request.getName().trim());
        project.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        project.setStartDate(request.getStartDate());
        project.setDeadline(request.getDeadline());
        project.setStatus(request.getStatus() != null ? request.getStatus() : ProjectStatus.NOT_STARTED);
        project.setCreatedBy(user);

        Project saved = projectRepository.save(project);
        return ProjectResponse.fromEntity(saved, user.getId(), user.getRole() == Role.ROLE_ADMIN);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(String userEmail, ProjectStatus status, String search) {
        User user = getAuthenticatedUser(userEmail);
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        List<Project> projects;

        if (search != null && !search.trim().isEmpty()) {
            String trimmedSearch = search.trim();
            if (isAdmin) {
                projects = projectRepository.searchByName(trimmedSearch);
            } else {
                projects = projectRepository.searchByName(trimmedSearch);
            }
        } else if (status != null) {
            if (isAdmin) {
                projects = projectRepository.findByStatus(status);
            } else {
                projects = projectRepository.findByStatus(status);
            }
        } else {
            if (isAdmin) {
                projects = projectRepository.findAllWithUser();
            } else {
                projects = projectRepository.findAllWithUser();
            }
        }

        // If status filter was requested alongside search
        if (status != null && search != null && !search.trim().isEmpty()) {
            projects = projects.stream()
                    .filter(p -> p.getStatus() == status)
                    .collect(Collectors.toList());
        }

        return projects.stream()
                .map(p -> ProjectResponse.fromEntity(p, user.getId(), isAdmin))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id, String userEmail) {
        User user = getAuthenticatedUser(userEmail);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        return ProjectResponse.fromEntity(project, user.getId(), user.getRole() == Role.ROLE_ADMIN);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, String userEmail) {
        validateDates(request);
        User user = getAuthenticatedUser(userEmail);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        checkManagementPermission(project, user);

        project.setName(request.getName().trim());
        project.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        project.setStartDate(request.getStartDate());
        project.setDeadline(request.getDeadline());
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        Project updated = projectRepository.save(project);
        return ProjectResponse.fromEntity(updated, user.getId(), user.getRole() == Role.ROLE_ADMIN);
    }

    @Transactional
    public ProjectResponse updateProjectStatus(Long id, StatusUpdateRequest request, String userEmail) {
        User user = getAuthenticatedUser(userEmail);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        checkManagementPermission(project, user);

        project.setStatus(request.getStatus());
        Project updated = projectRepository.save(project);

        return ProjectResponse.fromEntity(updated, user.getId(), user.getRole() == Role.ROLE_ADMIN);
    }

    @Transactional
    public void deleteProject(Long id, String userEmail) {
        User user = getAuthenticatedUser(userEmail);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        checkManagementPermission(project, user);

        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public StatsResponse getStats(String userEmail) {
        User user = getAuthenticatedUser(userEmail);
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        long notStarted;
        long inProgress;
        long completed;
        long total;
        Long totalUsers = null;

        if (isAdmin) {
            notStarted = projectRepository.countByStatus(ProjectStatus.NOT_STARTED);
            inProgress = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
            completed = projectRepository.countByStatus(ProjectStatus.COMPLETED);
            total = notStarted + inProgress + completed;
            totalUsers = userRepository.count();
        } else {
            notStarted = projectRepository.countByCreatedByIdAndStatus(user.getId(), ProjectStatus.NOT_STARTED);
            inProgress = projectRepository.countByCreatedByIdAndStatus(user.getId(), ProjectStatus.IN_PROGRESS);
            completed = projectRepository.countByCreatedByIdAndStatus(user.getId(), ProjectStatus.COMPLETED);
            total = notStarted + inProgress + completed;
        }

        return new StatsResponse(total, notStarted, inProgress, completed, totalUsers);
    }
}
