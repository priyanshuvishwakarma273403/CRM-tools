package com.crm.file;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StoredFileRepository extends JpaRepository<StoredFile, String> {
    List<StoredFile> findByOrganizationId(String organizationId);
    Optional<StoredFile> findByIdAndOrganizationId(String id, String organizationId);
    List<StoredFile> findByOrganizationIdAndRelatedEntityTypeAndRelatedEntityId(String organizationId, String entityType, String entityId);
}
