package com.sharebite.api.controller;

import com.sharebite.api.dto.ListingDto;
import com.sharebite.api.service.FoodListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final FoodListingService listingService;

    public ListingController(FoodListingService listingService) {
        this.listingService = listingService;
    }

    // Get all AVAILABLE and active listings (for Recipients to browse)
    @GetMapping
    public ResponseEntity<List<ListingDto>> getAllAvailableListings() {
        return ResponseEntity.ok(listingService.getAllAvailableListings());
    }

    // Create a new listing (Donors only)
    @PostMapping
    public ResponseEntity<ListingDto> createListing(@RequestBody ListingDto dto, Principal principal) {
        return ResponseEntity.ok(listingService.createListing(dto, principal.getName()));
    }

    // Update listing details (Donors only)
    @PutMapping("/{id}")
    public ResponseEntity<ListingDto> updateListing(@PathVariable Long id, @RequestBody ListingDto dto, Principal principal) {
        return ResponseEntity.ok(listingService.updateListing(id, dto, principal.getName()));
    }

    // Delete a listing (Donors only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id, Principal principal) {
        listingService.deleteListing(id, principal.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Listing deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Get listings created by the logged-in donor
    @GetMapping("/donor")
    public ResponseEntity<List<ListingDto>> getDonorListings(Principal principal) {
        return ResponseEntity.ok(listingService.getDonorListings(principal.getName()));
    }

    // Get listings claimed by the logged-in recipient
    @GetMapping("/recipient")
    public ResponseEntity<List<ListingDto>> getRecipientListings(Principal principal) {
        return ResponseEntity.ok(listingService.getRecipientListings(principal.getName()));
    }

    // Claim an available listing (Recipients only)
    @PostMapping("/{id}/claim")
    public ResponseEntity<ListingDto> claimListing(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(listingService.claimListing(id, principal.getName()));
    }

    // Verify pickup code to mark claimed listing as COMPLETED (Donors only)
    @PostMapping("/{id}/verify")
    public ResponseEntity<ListingDto> verifyPickupCode(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody,
            Principal principal) {
        
        String code = requestBody.get("pickupCode");
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("pickupCode is required");
        }
        
        return ResponseEntity.ok(listingService.verifyPickupCode(id, code, principal.getName()));
    }
}
