package com.crm.file;

import com.crm.common.dto.ApiResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<StoredFile>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "relatedEntityType", required = false) String relatedEntityType,
            @RequestParam(value = "relatedEntityId", required = false) String relatedEntityId) {
        StoredFile stored = fileStorageService.storeFile(file, relatedEntityType, relatedEntityId);
        return ResponseEntity.ok(ApiResponse.success(stored, "File uploaded successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StoredFile>>> listFiles() {
        return ResponseEntity.ok(ApiResponse.success(fileStorageService.listFiles()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StoredFile>> getFileMetadata(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(fileStorageService.getFileMetadata(id)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        StoredFile metadata = fileStorageService.getFileMetadata(id);
        Resource resource = fileStorageService.loadFileAsResource(id);

        String contentType = metadata.getFileType() != null ? metadata.getFileType() : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String id) {
        fileStorageService.deleteFile(id);
        return ResponseEntity.ok(ApiResponse.success(null, "File deleted successfully"));
    }
}
