package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {


}
