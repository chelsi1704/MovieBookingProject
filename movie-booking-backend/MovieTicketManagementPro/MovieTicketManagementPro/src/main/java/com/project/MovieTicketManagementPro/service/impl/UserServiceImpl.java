package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.UserRepository;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.mapper.UserMapper;
import com.project.MovieTicketManagementPro.model.User;
import com.project.MovieTicketManagementPro.model.Role;
import com.project.MovieTicketManagementPro.service.UserService;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SecurityUtil securityUtil;

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<UserProfileResponse> getMyProfile() {
        User user = securityUtil.getCurrentUser();
        return ApiResponse.success(
                "Profile fetched.",
                userMapper.toProfileResponse(user));
    }

    @Override
    public ApiResponse<UserProfileResponse> updateProfile(
            UpdateProfileRequest request) {

        User user = securityUtil.getCurrentUser();

        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());

        userRepository.save(user);
        return ApiResponse.success(
                "Profile updated.",
                userMapper.toProfileResponse(user));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<UserProfileResponse> getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return ApiResponse.success(
                "User fetched.",
                userMapper.toProfileResponse(user));
    }

    @Override
    public ApiResponse<String> deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        user.setActive(false);
        userRepository.save(user);
        return ApiResponse.success(
                "User deactivated successfully.", null);
    }

    @Override
    public ApiResponse<String> activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        user.setActive(true);
        userRepository.save(user);
        return ApiResponse.success(
                "User activated successfully.", null);
    }

    @Override
    public ApiResponse<String> changeUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        try {
            user.setRole(Role.valueOf(role.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid role: " + role
                            + ". Valid roles: USER, ADMIN, THEATER_OWNER");
        }
        userRepository.save(user);
        return ApiResponse.success(
                "User role changed to " + role + ".", null);
    }
}