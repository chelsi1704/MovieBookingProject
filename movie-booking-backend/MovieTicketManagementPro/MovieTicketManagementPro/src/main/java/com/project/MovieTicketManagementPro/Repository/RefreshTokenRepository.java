package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.RefreshToken;
import com.project.MovieTicketManagementPro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findAllByUser(User user);

    void deleteAllByExpiresAtBefore(LocalDateTime now);

    boolean existsByTokenAndIsRevokedFalse(String token);

    Optional<RefreshToken> findByTokenAndIsRevokedFalse(String token);
}
