package com.project.MovieTicketManagementPro.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.project.MovieTicketManagementPro.dto.response.ErrorResponse;
import com.project.MovieTicketManagementPro.exception.InvalidTokenException;
import com.project.MovieTicketManagementPro.exception.TokenExpiredException;
import com.project.MovieTicketManagementPro.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {

            String jwt = extractJwtFromRequest(request);

            if (jwt == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Step 3 — Extract email from token (does NOT validate yet)
            String email = jwtUtil.extractEmail(jwt);

            // Step 4 — Only authenticate if:
            //   a) email was found in token
            //   b) no authentication already set (avoid double-processing)
            if (email != null
                    && SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

                // Step 5 — Load full user from DB using email
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                // Step 6 — Full validation: signature + expiry + email match
                if (jwtUtil.validateToken(jwt, userDetails)) {

                    // Step 7 — Build authentication token
                    // UsernamePasswordAuthenticationToken with 3 args = authenticated
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,                          // credentials null after auth
                                    userDetails.getAuthorities()   // roles from UserDetails
                            );

                    // Step 8 — Attach request details (IP, session) to auth token
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // Step 9 — Store in SecurityContext
                    // From this point, any component can call
                    // SecurityContextHolder.getContext().getAuthentication()
                    // to know who made this request
                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);

                    log.debug("Authenticated user: {} for URI: {}",
                            email, request.getRequestURI());
                }
            }

        } catch (TokenExpiredException e) {
            // Token expired — send 401 with specific message
            // Frontend uses this to trigger the refresh token flow
            sendErrorResponse(response,
                    HttpStatus.UNAUTHORIZED,
                    "Access token has expired. Please refresh.");
            return;

        } catch (InvalidTokenException e) {
            // Token tampered or malformed — force re-login
            sendErrorResponse(response,
                    HttpStatus.UNAUTHORIZED,
                    e.getMessage());
            return;

        } catch (UsernameNotFoundException e) {
            // Token valid but user deleted from DB — reject
            sendErrorResponse(response,
                    HttpStatus.UNAUTHORIZED,
                    "User account no longer exists.");
            return;

        } catch (Exception e) {
            // Unexpected filter error — log and clear context
            log.error("JWT filter error for URI {}: {}",
                    request.getRequestURI(), e.getMessage());
            SecurityContextHolder.clearContext();
        }

        // Step 10 — Pass request to the next filter/controller
        filterChain.doFilter(request, response);
    }

    // ─────────────────────────────────────
    // EXTRACT JWT FROM REQUEST HEADER
    // Standard format: "Authorization: Bearer <token>"
    // Returns null if header missing or format wrong
    // ─────────────────────────────────────
    private String extractJwtFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        // Must start with "Bearer " — 7 characters
        if (StringUtils.hasText(authHeader)
                && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // everything after "Bearer "
        }

        return null; // no valid token found
    }

    // ─────────────────────────────────────
    // SEND JSON ERROR RESPONSE FROM FILTER
    // Filters run before controllers — we can't use @ExceptionHandler here
    // So we write directly to the response using ObjectMapper
    // ─────────────────────────────────────
    private void sendErrorResponse(HttpServletResponse response,
                                   HttpStatus status,
                                   String message) throws IOException {
        // Clear any partial authentication
        SecurityContextHolder.clearContext();

        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Build the same ErrorResponse shape as GlobalExceptionHandler
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .message(message)
                .statusCode(status.value())
                .timestamp(LocalDateTime.now())
                .build();

        // Write JSON directly to response body
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule()); // needed for LocalDateTime
        response.getWriter().write(
                mapper.writeValueAsString(errorResponse)
        );
    }

    // ─────────────────────────────────────
    // SHOULD NOT FILTER — skip certain paths
    // These paths are public — no JWT processing needed
    // Saves unnecessary DB calls for login/register/swagger requests
    // ─────────────────────────────────────
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        // Paths that are completely public — skip JWT filter entirely
        return path.startsWith("/api/auth/")
                || path.startsWith("/oauth2/")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/actuator/health");
    }
}
