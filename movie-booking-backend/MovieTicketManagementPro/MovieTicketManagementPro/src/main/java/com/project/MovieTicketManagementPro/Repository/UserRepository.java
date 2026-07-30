package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.AuthProvider;
import com.project.MovieTicketManagementPro.model.Role;
import com.project.MovieTicketManagementPro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByProviderAndProviderId(
            AuthProvider provider, String providerId);

    List<User> findByRole(Role role);

    List<User> findByIsActive(Boolean isActive);

    List<User> findByNameContainingIgnoreCase(String name);

    // This one is CORRECT — has @Query annotation
    @Query("SELECT COUNT(u) FROM User u " +
            "WHERE u.createdAt BETWEEN :start AND :end")
    Long countUserRegisteredBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

}