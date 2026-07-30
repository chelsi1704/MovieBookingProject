package com.project.MovieTicketManagementPro.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserService
        extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        if (email == null || email.isBlank()) {
            log.error("Google OAuth2 response missing email attribute");
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("missing_email"),
                    "Email not provided by Google. " +
                            "Please grant email permission and try again."
            );
        }

        log.debug("OAuth2 user loaded successfully for email: {}", email);

        return oAuth2User;
    }
}
