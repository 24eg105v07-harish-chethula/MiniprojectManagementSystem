package com.project.management.dto;

public class StatsResponse {

    private long totalProjects;
    private long notStarted;
    private long inProgress;
    private long completed;
    private Long totalUsers; // null for non-admin users if desired, or populated

    public StatsResponse() {
    }

    public StatsResponse(long totalProjects, long notStarted, long inProgress, long completed, Long totalUsers) {
        this.totalProjects = totalProjects;
        this.notStarted = notStarted;
        this.inProgress = inProgress;
        this.completed = completed;
        this.totalUsers = totalUsers;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getNotStarted() {
        return notStarted;
    }

    public void setNotStarted(long notStarted) {
        this.notStarted = notStarted;
    }

    public long getInProgress() {
        return inProgress;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }
}
