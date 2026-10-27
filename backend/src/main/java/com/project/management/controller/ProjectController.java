package com.project.management.controller;

import com.project.management.dto.*;
import com.project.management.entity.ProjectStatus;
import com.project.management.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String search,
            Authentication authentication) {
        List<ProjectResponse> projects = projectService.getProjects(authentication.getName(), status, search);
        return ResponseEntity.ok(ApiResponse.ok("Projects fetched successfully", projects));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        ProjectResponse response = projectService.createProject(request, authentication.getName());
        return new ResponseEntity<>(ApiResponse.ok("Project created successfully!", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(
            @PathVariable Long id,
            Authentication authentication) {
        ProjectResponse response = projectService.getProjectById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Project details retrieved", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        ProjectResponse response = projectService.updateProject(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Project updated successfully!", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProjectStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication) {
        ProjectResponse response = projectService.updateProjectStatus(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Project status updated successfully!", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id,
            Authentication authentication) {
        projectService.deleteProject(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Project deleted successfully!"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats(Authentication authentication) {
        StatsResponse stats = projectService.getStats(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Project statistics fetched", stats));
    }
}
