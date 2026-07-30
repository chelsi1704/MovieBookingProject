package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.*;

public interface UserService {

    ApiResponse<UserProfileResponse> getMyProfile();

    ApiResponse<UserProfileResponse> updateProfile(UpdateProfileRequest request);

    ApiResponse<UserProfileResponse> getUserById(Long id);

    ApiResponse<String> deactivateUser(Long id);

    ApiResponse<String> activateUser(Long id);

    ApiResponse<String> changeUserRole(Long id, String role);
}