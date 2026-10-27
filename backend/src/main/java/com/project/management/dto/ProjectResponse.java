package com.project.management.dto;

import com.project.management.entity.Project;
import com.project.management.entity.ProjectStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate deadline;
    private ProjectStatus status;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private boolean canEdit;
    private boolean canDelete;

    public ProjectResponse() {
    }

    public ProjectResponse(Long id, String name, String description, LocalDate startDate, LocalDate deadline,
                           ProjectStatus status, UserResponse createdBy, LocalDateTime createdAt,
                           boolean canEdit, boolean canDelete) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.deadline = deadline;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.canEdit = canEdit;
        this.canDelete = canDelete;
    }

    public static ProjectResponse fromEntity(Project project, Long currentUserId, boolean isAdmin) {
        if (project == null) return null;
        boolean isOwner = project.getCreatedBy() != null && project.getCreatedBy().getId().equals(currentUserId);
        boolean canManage = isAdmin || isOwner;

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStartDate(),
                project.getDeadline(),
                project.getStatus(),
                UserResponse.fromEntity(project.getCreatedBy()),
                project.getCreatedAt(),
                canManage,
                canManage
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isCanEdit() {
        return canEdit;
    }

    public void setCanEdit(boolean canEdit) {
        this.canEdit = canEdit;
    }

    public boolean isCanDelete() {
        return canDelete;
    }

    public void setCanDelete(boolean canDelete) {
        this.canDelete = canDelete;
    }
}
