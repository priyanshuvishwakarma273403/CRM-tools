package com.crm.knowledge.rag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmbeddingChunkRepository extends JpaRepository<EmbeddingChunk, String> {

    List<EmbeddingChunk> findAllByOrganizationIdAndEntityType(String organizationId, String entityType);

    List<EmbeddingChunk> findByOrganizationIdAndEntityIdAndEntityType(String organizationId, String entityId, String entityType);

    void deleteByOrganizationIdAndEntityIdAndEntityType(String organizationId, String entityId, String entityType);
}
