package com.project.MovieTicketManagementPro.service;

import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.ApiResponse;
import com.project.MovieTicketManagementPro.dto.response.AuthResponse;
import com.project.MovieTicketManagementPro.dto.response.TokenRefreshResponse;
import com.project.MovieTicketManagementPro.model.OtpPurpose;

public interface AuthService {

    // Register new user with email + password
    // Sends OTP to email for verification
    ApiResponse<String> register(RegisterRequest request);

    // Verify email using OTP sent after registration
    ApiResponse<String> verifyRegistrationOtp(VerifyOtpRequest request);

    // Resend OTP if user didn't receive it or it expired
    ApiResponse<String> resendOtp(String email, OtpPurpose purpose);

    // Login with email + password — returns JWT tokens
    ApiResponse<AuthResponse> login(LoginRequest request);

    // Exchange expired access token for a new one using refresh token
    ApiResponse<TokenRefreshResponse> refreshToken(RefreshTokenRequest request);

    // Send OTP to email for password reset
    ApiResponse<String> forgotPassword(ForgotPasswordRequest request);

    // Verify OTP sent for password reset — returns a short-lived reset token
    ApiResponse<String> verifyPasswordResetOtp(VerifyOtpRequest request);

    // Set a new password after OTP verification
    ApiResponse<String> resetPassword(ResetPasswordRequest request);

    // Change password when already logged in
    ApiResponse<String> changePassword(ChangePasswordRequest request);

    // Logout — revoke the refresh token
    ApiResponse<String> logout(RefreshTokenRequest request);

    // Logout from all devices — revoke all refresh tokens
    ApiResponse<String> logoutAllDevices();
}