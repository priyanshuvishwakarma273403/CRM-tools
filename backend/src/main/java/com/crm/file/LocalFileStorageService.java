package com.crm.file;

import com.crm.common.exception.ResourceNotFoundException;
import com.crm.organization.Organization;
import com.crm.organization.OrganizationRepository;
import com.crm.security.TenantContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
public class LocalFileStorageService implements FileStorageService {

    private final Path fileStorageLocation;
    private final StoredFileRepository storedFileRepository;
    private final OrganizationRepository organizationRepository;

    public LocalFileStorageService(@Value("${storage.upload-dir:./uploads}") String uploadDir,
                                   StoredFileRepository storedFileRepository,
                                   OrganizationRepository organizationRepository) {
        this.storedFileRepository = storedFileRepository;
        this.organizationRepository = organizationRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            log.warn("Could not create upload directory: {}", ex.getMessage());
        }
    }

    @Override
    @Transactional
    public StoredFile storeFile(MultipartFile file, String relatedEntityType, String relatedEntityId) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String orgId = TenantContext.getCurrentTenant();

        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        try {
            if (originalFileName.contains("..")) {
                throw new IllegalArgumentException("Filename contains invalid path sequence: " + originalFileName);
            }

            String fileExtension = "";
            int extIndex = originalFileName.lastIndexOf('.');
            if (extIndex > 0) {
                fileExtension = originalFileName.substring(extIndex);
            }

            String storedFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            StoredFile storedFile = StoredFile.builder()
                    .organization(org)
                    .fileName(originalFileName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(targetLocation.toString())
                    .fileUrl("/api/v1/files/download/" + storedFileName)
                    .relatedEntityType(relatedEntityType)
                    .relatedEntityId(relatedEntityId)
                    .build();

            return storedFileRepository.save(storedFile);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileId) {
        StoredFile storedFile = getFileMetadata(fileId);
        try {
            Path filePath = Paths.get(storedFile.getStoragePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found on disk: " + storedFile.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File URL malformed: " + storedFile.getFileName());
        }
    }

    @Override
    public List<StoredFile> listFiles() {
        String orgId = TenantContext.getCurrentTenant();
        return storedFileRepository.findByOrganizationId(orgId);
    }

    @Override
    public StoredFile getFileMetadata(String fileId) {
        String orgId = TenantContext.getCurrentTenant();
        return storedFileRepository.findByIdAndOrganizationId(fileId, orgId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId));
    }

    @Override
    @Transactional
    public void deleteFile(String fileId) {
        StoredFile storedFile = getFileMetadata(fileId);
        try {
            Path path = Paths.get(storedFile.getStoragePath());
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Failed to delete physical file: {}", e.getMessage());
        }
        storedFileRepository.delete(storedFile);
    }
}
