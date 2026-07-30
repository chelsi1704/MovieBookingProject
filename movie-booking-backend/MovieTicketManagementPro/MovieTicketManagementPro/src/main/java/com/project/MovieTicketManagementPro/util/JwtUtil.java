package com.project.MovieTicketManagementPro.util;

import com.project.MovieTicketManagementPro.exception.InvalidTokenException;
import com.project.MovieTicketManagementPro.exception.TokenExpiredException;
import com.project.MovieTicketManagementPro.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.access-token-expiry}")
    private Long accessTokenExpiry;

    @Value("${app.jwt.refresh-token-expiry}")
    private Long refreshTokenExpiry;

    // Converts Base64 secret string into a cryptographic signing key
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generates short-lived access token (15 min)
    // Stores userId, role, name, tokenType as extra claims
    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().name());
        claims.put("name", user.getName());
        claims.put("tokenType", "ACCESS");
        return buildToken(claims, user.getEmail(), accessTokenExpiry);
    }

    // Generates long-lived refresh token (7 days)
    // Minimal payload — only tokenType stored
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "REFRESH");
        return buildToken(claims, user.getEmail(), refreshTokenExpiry);
    }

    // Assembles and signs the JWT — used by both generate methods above
    private String buildToken(Map<String, Object> extraClaims,
                              String subject,
                              Long expiry) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + expiry))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extracts email (subject) from token — used by JwtAuthFilter
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extracts userId claim — avoids DB call just for the ID
    public Long extractUserId(String token) {
        return extractClaim(token,
                claims -> claims.get("userId", Long.class));
    }

    // Extracts role claim — used for authorization without DB call
    public String extractRole(String token) {
        return extractClaim(token,
                claims -> claims.get("role", String.class));
    }

    // Extracts tokenType — ACCESS or REFRESH
    // Used to prevent refresh tokens being used as access tokens
    public String extractTokenType(String token) {
        return extractClaim(token,
                claims -> claims.get("tokenType", String.class));
    }

    // Extracts expiration date from token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic extractor — all specific extractors above call this
    public <T> T extractClaim(String token,
                              Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Parses and verifies token signature — throws JwtException if invalid
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Returns true if token expiry date is before now
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Full token validation — checks signature, expiry, email, and type
    // Called from JwtAuthFilter on every protected request
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String email = extractEmail(token);
            String tokenType = extractTokenType(token);

            // Reject if someone sends a refresh token as access token
            if ("REFRESH".equals(tokenType)) {
                log.warn("Attempt to use refresh token as access token");
                return false;
            }

            return email.equals(userDetails.getUsername())
                    && !isTokenExpired(token);

        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired: {}", e.getMessage());
            throw new TokenExpiredException();
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token: {}", e.getMessage());
            throw new InvalidTokenException("Token format is not supported");
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token: {}", e.getMessage());
            throw new InvalidTokenException("Token is malformed");
        } catch (SignatureException e) {
            // This is io.jsonwebtoken.security.SignatureException
            // NOT java.security.SignatureException — that was the bug
            log.warn("Invalid JWT signature: {}", e.getMessage());
            throw new InvalidTokenException("Token signature is invalid");
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
            throw new InvalidTokenException("Token claims are empty");
        }
    }

    // Validates refresh token structure only — no UserDetails needed
    // DB check (revoked/exists) is done separately in AuthService
    public boolean validateRefreshToken(String token) {
        try {
            String tokenType = extractTokenType(token);
            if (!"REFRESH".equals(tokenType)) {
                return false;
            }
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid refresh token: {}", e.getMessage());
            return false;
        }
    }

    // Returns access token expiry in ms — sent to frontend
    // so it can schedule a refresh call before expiry
    public Long getAccessTokenExpiryMs() {
        return accessTokenExpiry;
    }
}