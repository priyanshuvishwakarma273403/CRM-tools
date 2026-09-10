package com.crm.contact;

import com.crm.common.dto.ApiResponse;
import com.crm.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Contact>>> getContacts(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(contactService.getContacts(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> getContactById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(contactService.getContactById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> createContact(@RequestBody Contact contact) {
        return ResponseEntity.ok(ApiResponse.success(contactService.createContact(contact), "Contact created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> updateContact(@PathVariable String id, @RequestBody Contact contact) {
        return ResponseEntity.ok(ApiResponse.success(contactService.updateContact(id, contact), "Contact updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable String id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Contact deleted successfully"));
    }
}
