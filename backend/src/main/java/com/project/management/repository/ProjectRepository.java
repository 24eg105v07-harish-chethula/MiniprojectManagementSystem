package com.project.management.repository;

import com.project.management.entity.Project;
import com.project.management.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p JOIN FETCH p.createdBy ORDER BY p.createdAt DESC")
    List<Project> findAllWithUser();

    @Query("SELECT p FROM Project p JOIN FETCH p.createdBy WHERE p.createdBy.id = :userId ORDER BY p.createdAt DESC")
    List<Project> findByCreatedByIdWithUser(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p JOIN FETCH p.createdBy WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.createdAt DESC")
    List<Project> searchByName(@Param("name") String name);

    @Query("SELECT p FROM Project p JOIN FETCH p.createdBy WHERE p.createdBy.id = :userId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.createdAt DESC")
    List<Project> searchByNameAndUserId(@Param("name") String name, @Param("userId") Long userId);

    @Query("SELECT p FROM Project p JOIN FETCH p.createdBy WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Project> findByStatus(@Param("status") ProjectStatus status);

    @Query("SELECT p FROM Project p JOIN FETCH p.createdBy WHERE p.createdBy.id = :userId AND p.status = :status ORDER BY p.createdAt DESC")
    List<Project> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ProjectStatus status);

    long countByStatus(ProjectStatus status);

    long countByCreatedByIdAndStatus(Long userId, ProjectStatus status);

    long countByCreatedById(Long userId);
}
