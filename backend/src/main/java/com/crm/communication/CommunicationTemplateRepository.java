package com.crm.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunicationTemplateRepository extends JpaRepository<CommunicationTemplate, String> {

    List<CommunicationTemplate> findAllByOrganizationIdOrderByCreatedAtDesc(String organizationId);

    List<CommunicationTemplate> findAllByOrganizationIdAndChannelOrderByCreatedAtDesc(String organizationId, String channel);

    List<CommunicationTemplate> findAllByOrganizationIdAndCategoryOrderByCreatedAtDesc(String organizationId, String category);

    Optional<CommunicationTemplate> findByIdAndOrganizationId(String id, String organizationId);
}
