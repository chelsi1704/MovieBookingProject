package com.project.MovieTicketManagementPro.service.impl;

import com.project.MovieTicketManagementPro.Repository.AuditLogRepository;
import com.project.MovieTicketManagementPro.Repository.OtpVerificationRepository;
import com.project.MovieTicketManagementPro.Repository.RefreshTokenRepository;
import com.project.MovieTicketManagementPro.Repository.UserRepository;
import com.project.MovieTicketManagementPro.dto.request.*;
import com.project.MovieTicketManagementPro.dto.response.ApiResponse;
import com.project.MovieTicketManagementPro.dto.response.AuthResponse;
import com.project.MovieTicketManagementPro.dto.response.TokenRefreshResponse;
import com.project.MovieTicketManagementPro.dto.response.UserSummaryResponse;
import com.project.MovieTicketManagementPro.exception.*;
import com.project.MovieTicketManagementPro.model.*;
import com.project.MovieTicketManagementPro.service.EmailService;
import com.project.MovieTicketManagementPro.util.SecurityUtil;
import com.project.MovieTicketManagementPro.service.AuthService;
import com.project.MovieTicketManagementPro.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional  // all methods run inside a transaction by default
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpVerificationRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final SecurityUtil securityUtil;
    private final AuditLogRepository auditLogRepository;

    private static final int OTP_EXPIRY_MINUTES = 10;


    private static final int MAX_OTP_ATTEMPTS = 5;

    @Override
    public ApiResponse<String> register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .isVerified(false)
                .isActive(true)
                .build();

        userRepository.save(user);

        sendOtp(request.getEmail(), OtpPurpose.REGISTER);

        log.info("New user registered: {}", request.getEmail());

        saveAuditLog("USER_REGISTERED", "User", user.getId(),
                request.getEmail(), null);

        return ApiResponse.success(
                "Registration successful! Please check your email for the " +
                        "6-digit OTP to verify your account.",
                null
        );
    }

    @Override
    public ApiResponse<String> verifyRegistrationOtp(VerifyOtpRequest request) {

        validateAndConsumeOtp(
                request.getEmail(),
                request.getOtpCode(),
                OtpPurpose.REGISTER
        );


        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        user.setVerified(true);
        userRepository.save(user);

        log.info("User verified successfully: {}", request.getEmail());
        saveAuditLog("USER_VERIFIED", "User", user.getId(),
                request.getEmail(), null);

        return ApiResponse.success(
                "Email verified successfully! You can now login.", null
        );
    }

    @Override
    public ApiResponse<String> resendOtp(String email, OtpPurpose purpose) {

        if (purpose == OtpPurpose.REGISTER) {
            userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException(email));
        }

        otpRepository.deleteByEmailAndPurpose(email, purpose);

        sendOtp(email, purpose);

        return ApiResponse.success(
                "A new OTP has been sent to " + email +
                        ". It is valid for " + OTP_EXPIRY_MINUTES + " minutes.",
                null
        );
    }

    @Override
    public ApiResponse<AuthResponse> login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isVerified()) {
            throw new AccountNotVerifiedException();
        }
        if (!user.isActive()) {
            throw new AccountDisabledException();
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String accessToken = jwtUtil.generateAccessToken(user);

        String refreshTokenValue = generateAndSaveRefreshToken(user);

        log.info("User logged in successfully: {}", request.getEmail());
        saveAuditLog("LOGIN_SUCCESS", "User", user.getId(),
                request.getEmail(), null);

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .accessTokenExpiresIn(jwtUtil.getAccessTokenExpiryMs())
                .user(buildUserSummary(user))
                .build();

        return ApiResponse.success("Login successful!", authResponse);
    }

    @Override
    public ApiResponse<TokenRefreshResponse> refreshToken(
            RefreshTokenRequest request) {

        String tokenValue = request.getRefreshToken();

        if (!jwtUtil.validateRefreshToken(tokenValue)) {
            throw new InvalidTokenException(
                    "Refresh token is invalid or expired. Please login again.");
        }

        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenAndIsRevokedFalse(tokenValue)
                .orElseThrow(() -> new InvalidTokenException(
                        "Refresh token not found or has been revoked. Please login again."));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new TokenExpiredException();
        }

        User user = refreshToken.getUser();
        if (!user.isActive()) {
            throw new AccountDisabledException();
        }

        String newAccessToken = jwtUtil.generateAccessToken(user);

        log.debug("Token refreshed for user: {}", user.getEmail());

        TokenRefreshResponse response = TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenExpiryMs())
                .build();

        return ApiResponse.success("Token refreshed successfully.", response);
    }

    @Override
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (user.getProvider() == AuthProvider.GOOGLE) {
                // Still return generic message — don't reveal provider
                log.info("Password reset attempted for Google account: {}",
                        request.getEmail());
            } else {
                otpRepository.deleteByEmailAndPurpose(
                        request.getEmail(), OtpPurpose.RESET_PASSWORD);
                sendOtp(request.getEmail(), OtpPurpose.RESET_PASSWORD);
            }
        }

        return ApiResponse.success(
                "If an account exists with this email, a password reset OTP " +
                        "has been sent. Please check your inbox.",
                null
        );
    }

    @Override
    public ApiResponse<String> verifyPasswordResetOtp(VerifyOtpRequest request) {

        OtpVerification otp = otpRepository
                .findTopByEmailAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
                        request.getEmail(), OtpPurpose.RESET_PASSWORD)
                .orElseThrow(() -> new InvalidOtpException(
                        "No active OTP found for this email. Please request a new one."));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException(
                    "OTP has expired. Please request a new one.");
        }

        if (!otp.getOtpCode().equals(request.getOtpCode())) {
            throw new InvalidOtpException(
                    "Incorrect OTP. Please check and try again.");
        }

        return ApiResponse.success(
                "OTP verified. Please set your new password.", null
        );
    }

    @Override
    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new PasswordMismatchException(
                    "New password and confirm password do not match.");
        }

        validateAndConsumeOtp(
                request.getEmail(),
                request.getOtpCode(),
                OtpPurpose.RESET_PASSWORD
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        revokeAllUserTokens(user);

        log.info("Password reset successfully for: {}", request.getEmail());
        saveAuditLog("PASSWORD_RESET", "User", user.getId(),
                request.getEmail(), null);

        return ApiResponse.success(
                "Password reset successfully. Please login with your new password.",
                null
        );
    }

    @Override
    public ApiResponse<String> changePassword(ChangePasswordRequest request) {

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new PasswordMismatchException(
                    "New password and confirm password do not match.");
        }

        User user = securityUtil.getCurrentUser();

        if (user.getProvider() == AuthProvider.GOOGLE) {
            throw new PasswordMismatchException(
                    "Google login users cannot set a password through this flow. " +
                            "Please use Google Account settings.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(),
                user.getPassword())) {
            throw new PasswordMismatchException(
                    "Current password is incorrect.");
        }

        if (passwordEncoder.matches(request.getNewPassword(),
                user.getPassword())) {
            throw new PasswordMismatchException(
                    "New password must be different from your current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        revokeAllUserTokens(user);

        log.info("Password changed for user: {}", user.getEmail());
        saveAuditLog("PASSWORD_CHANGED", "User", user.getId(),
                user.getEmail(), null);

        return ApiResponse.success(
                "Password changed successfully. Please login again on other devices.",
                null
        );
    }

    @Override
    public ApiResponse<String> logout(RefreshTokenRequest request) {

        refreshTokenRepository
                .findByTokenAndIsRevokedFalse(request.getRefreshToken())
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                    log.info("User logged out, token revoked for user: {}",
                            token.getUser().getEmail());
                    saveAuditLog("LOGOUT", "User",
                            token.getUser().getId(),
                            token.getUser().getEmail(), null);
                });

        return ApiResponse.success(
                "Logged out successfully.", null
        );
    }

    @Override
    public ApiResponse<String> logoutAllDevices() {

        User user = securityUtil.getCurrentUser();
        revokeAllUserTokens(user);

        log.info("All devices logged out for user: {}", user.getEmail());
        saveAuditLog("LOGOUT_ALL_DEVICES", "User", user.getId(),
                user.getEmail(), null);

        return ApiResponse.success(
                "Logged out from all devices successfully.", null
        );
    }

    private void sendOtp(String email, OtpPurpose purpose) {
        String otpCode = generateSixDigitOtp();

        OtpVerification otp = OtpVerification.builder()
                .email(email)
                .otpCode(otpCode)
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .isUsed(false)
                .build();

        otpRepository.save(otp);

        if (purpose == OtpPurpose.REGISTER) {
            emailService.sendRegistrationOtpEmail(email, otpCode);
        } else {
            emailService.sendPasswordResetOtpEmail(email, otpCode);
        }

        log.debug("OTP sent to {} for purpose: {}", email, purpose);
    }

    private void validateAndConsumeOtp(String email,
                                       String otpCode,
                                       OtpPurpose purpose) {

        OtpVerification otp = otpRepository
                .findTopByEmailAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
                        email, purpose)
                .orElseThrow(() -> new InvalidOtpException(
                        "No active OTP found. Please request a new one."));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException(
                    "OTP has expired. Please request a new one.");
        }

        if (!otp.getOtpCode().equals(otpCode)) {
            throw new InvalidOtpException(
                    "Incorrect OTP. Please check and try again.");
        }

        otp.setUsed(true);
        otpRepository.save(otp);
    }

    private String generateSixDigitOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // range: 100000–999999
        return String.valueOf(otp);
    }

    private String generateAndSaveRefreshToken(User user) {

        String tokenValue = jwtUtil.generateRefreshToken(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenValue)
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return tokenValue;
    }

    private void revokeAllUserTokens(User user) {
        List<RefreshToken> tokens = refreshTokenRepository.findAllByUser(user);
        tokens.forEach(t -> t.setRevoked(true));
        refreshTokenRepository.saveAll(tokens);
        log.debug("Revoked {} refresh tokens for user: {}",
                tokens.size(), user.getEmail());
    }

    private UserSummaryResponse buildUserSummary(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .isVerified(user.isVerified())
                .build();
    }

    private void saveAuditLog(String action,
                              String entityType,
                              Long entityId,
                              String metadata,
                              String ipAddress) {
        try {
            AuditLog log = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .metadata(metadata)
                    .ipAddress(ipAddress)
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            log.error("Failed to save audit log for action {}: {}",
                    action, e.getMessage());
        }
    }
}