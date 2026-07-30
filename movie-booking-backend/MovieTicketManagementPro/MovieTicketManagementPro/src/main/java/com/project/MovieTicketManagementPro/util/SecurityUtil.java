package com.project.MovieTicketManagementPro.util;

import com.project.MovieTicketManagementPro.Repository.UserRepository;
import com.project.MovieTicketManagementPro.exception.UnauthorizedAccessException;
import com.project.MovieTicketManagementPro.exception.UserNotFoundException;
import com.project.MovieTicketManagementPro.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityUtil {

    private final UserRepository userRepository;

    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder
                .getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedAccessException(
                    "No authenticated user found in context");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof UserDetails userDetails) {

            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UserNotFoundException(
                            userDetails.getUsername()))
                    .getId();
        }

        throw new UnauthorizedAccessException("Unable to extract user from context");
    }

    public User getCurrentUser() {
        Long userId = getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    public String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder
                .getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedAccessException("No authenticated user found");
        }

        return auth.getName();
    }

    public boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder
                .getContext().getAuthentication();

        if (auth == null) return false;

        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority()
                        .equals("ROLE_" + role));
    }

    public boolean isAdmin() {
        return hasRole("ADMIN");
    }
}
