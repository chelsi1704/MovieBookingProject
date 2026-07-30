package com.project.MovieTicketManagementPro.controller;

import com.project.MovieTicketManagementPro.Repository.UserRepository;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.ApiResponse;
import com.project.MovieTicketManagementPro.dto.response.AuthResponse;
import com.project.MovieTicketManagementPro.dto.response.TokenRefreshResponse;
import com.project.MovieTicketManagementPro.dto.response.UserSummaryResponse;
import com.project.MovieTicketManagementPro.exception.UserNotFoundException;
import com.project.MovieTicketManagementPro.model.OtpPurpose;
import com.project.MovieTicketManagementPro.model.User;
import com.project.MovieTicketManagementPro.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(
        name = "Authentication",
        description = "Register, login, OTP, password reset, and token management"
)
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account and sends OTP for verification."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Registered successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Email already exists"
            )
    })
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        ApiResponse<String> response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/verify-otp")
    @Operation(
            summary = "Verify OTP",
            description = "Verifies registration or password reset OTP."
    )
    public ResponseEntity<ApiResponse<String>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {

        ApiResponse<String> response;

        if (request.getPurpose() == OtpPurpose.REGISTER) {
            response = authService.verifyRegistrationOtp(request);
        } else {
            response = authService.verifyPasswordResetOtp(request);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-otp")
    @Operation(
            summary = "Resend OTP",
            description = "Sends a fresh OTP."
    )
    public ResponseEntity<ApiResponse<String>> resendOtp(
            @RequestParam @Email @NotBlank String email,
            @RequestParam OtpPurpose purpose
    ) {

        ApiResponse<String> response =
                authService.resendOtp(email, purpose);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(
            summary = "Login",
            description = "Authenticates user and returns JWT tokens."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Login successful"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Invalid credentials"
            )
    })
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        ApiResponse<AuthResponse> response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    @Operation(
            summary = "Refresh access token",
            description = "Generates new access token using refresh token."
    )
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {

        ApiResponse<TokenRefreshResponse> response =
                authService.refreshToken(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    @Operation(
            summary = "Forgot password",
            description = "Sends password reset OTP."
    )
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        ApiResponse<String> response =
                authService.forgotPassword(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Reset password",
            description = "Resets password using OTP."
    )
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        ApiResponse<String> response =
                authService.resetPassword(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    @Operation(
            summary = "Change password",
            description = "Changes current user's password.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        ApiResponse<String> response =
                authService.changePassword(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Logout",
            description = "Revokes refresh token.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<ApiResponse<String>> logout(
            @Valid @RequestBody RefreshTokenRequest request
    ) {

        ApiResponse<String> response =
                authService.logout(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout-all")
    @Operation(
            summary = "Logout all devices",
            description = "Revokes all refresh tokens.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<ApiResponse<String>> logoutAllDevices() {

        ApiResponse<String> response =
                authService.logoutAllDevices();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(
            summary = "Get current user",
            description = "Returns authenticated user info.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<ApiResponse<UserSummaryResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                userDetails.getUsername()
                        )
                );

        UserSummaryResponse summary = UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .isVerified(user.isVerified())
                .build();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User fetched successfully.",
                        summary
                )
        );
    }
}