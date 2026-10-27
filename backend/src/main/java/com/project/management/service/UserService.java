package com.project.management.service;

import com.project.management.dto.UserResponse;
import com.project.management.repository.ProjectRepository;
import com.project.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public UserService(UserRepository userRepository, ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> {
                    UserResponse resp = UserResponse.fromEntity(u);
                    resp.setProjectCount(projectRepository.countByCreatedById(u.getId()));
                    return resp;
                })
                .collect(Collectors.toList());
    }
}
