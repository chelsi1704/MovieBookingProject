package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {

    Optional<Language> findByCode(String code);

    boolean existsByNameIgnoreCase(String name);

    List<Language> findByIdIn(List<Long> ids);
}
