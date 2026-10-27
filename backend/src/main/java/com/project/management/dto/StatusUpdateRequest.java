package com.project.management.dto;

import com.project.management.entity.ProjectStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ProjectStatus status;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(ProjectStatus status) {
        this.status = status;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
}
