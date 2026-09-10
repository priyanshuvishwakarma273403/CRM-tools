package com.crm.file;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {
    StoredFile storeFile(MultipartFile file, String relatedEntityType, String relatedEntityId);
    Resource loadFileAsResource(String fileId);
    List<StoredFile> listFiles();
    StoredFile getFileMetadata(String fileId);
    void deleteFile(String fileId);
}
