package com.project.MovieTicketManagementPro.security;

import com.project.MovieTicketManagementPro.Repository.RefreshTokenRepository;
import com.project.MovieTicketManagementPro.Repository.UserRepository;
import com.project.MovieTicketManagementPro.model.AuthProvider;
import com.project.MovieTicketManagementPro.model.RefreshToken;
import com.project.MovieTicketManagementPro.model.Role;
import com.project.MovieTicketManagementPro.model.User;
import com.project.MovieTicketManagementPro.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/oauth2/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String googleId = oAuth2User.getAttribute("sub"); // Google's unique user ID
        Boolean emailVerified = oAuth2User.getAttribute("email_verified");

        log.info("OAuth2 login success for email: {}", email);

        User user = findOrCreateGoogleUser(
                email, name, picture, googleId, emailVerified);

        String accessToken = jwtUtil.generateAccessToken(user);

        String refreshTokenValue = jwtUtil.generateRefreshToken(user);
        saveRefreshToken(user, refreshTokenValue);

        String targetUrl = UriComponentsBuilder
                .fromUriString(redirectUri)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshTokenValue)
                .build().toUriString();

        log.debug("Redirecting to: {}", targetUrl);

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private User findOrCreateGoogleUser(String email,
                                        String name,
                                        String picture,
                                        String googleId,
                                        Boolean emailVerified) {

        Optional<User> existingByProvider =
                userRepository.findByProviderAndProviderId(
                        AuthProvider.GOOGLE, googleId);

        if (existingByProvider.isPresent()) {
            User user = existingByProvider.get();
            user.setName(name);
            user.setAvatarUrl(picture);
            return userRepository.save(user);
        }

        Optional<User> existingByEmail = userRepository.findByEmail(email);
        if (existingByEmail.isPresent()) {
            User user = existingByEmail.get();

            user.setProvider(AuthProvider.GOOGLE);
            user.setProviderId(googleId);
            user.setAvatarUrl(picture);
            user.setVerified(true);
            return userRepository.save(user);
        }

        User newUser = User.builder()
                .name(name)
                .email(email)
                .password(null)
                .role(Role.USER)
                .provider(AuthProvider.GOOGLE)
                .providerId(googleId)
                .avatarUrl(picture)

                .isVerified(Boolean.TRUE.equals(emailVerified))
                .isActive(true)
                .build();

        log.info("Creating new Google user for email: {}", email);
        return userRepository.save(newUser);
    }

    private void saveRefreshToken(User user, String tokenValue) {
        List<RefreshToken> existingTokens =
                refreshTokenRepository.findAllByUser(user);
        existingTokens.forEach(t -> t.setRevoked(true));
        refreshTokenRepository.saveAll(existingTokens);


        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenValue)
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
    }
}