package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    List<Person> findByNameContainingIgnoreCase(String name);

    boolean existsByNameAndBirthDate(String name, LocalDate birthDate);
}
