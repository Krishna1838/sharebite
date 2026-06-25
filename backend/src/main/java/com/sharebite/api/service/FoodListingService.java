package com.sharebite.api.service;

import com.sharebite.api.dto.ListingDto;
import com.sharebite.api.model.FoodListing;
import com.sharebite.api.model.ListingStatus;
import com.sharebite.api.model.User;
import com.sharebite.api.repository.FoodListingRepository;
import com.sharebite.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class FoodListingService {

    private final FoodListingRepository listingRepository;
    private final UserRepository userRepository;

    public FoodListingService(FoodListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ListingDto> getAllAvailableListings() {
        // Return listings that are AVAILABLE and have not yet expired
        return listingRepository.findByStatusAndExpiresAtAfterOrderByCreatedAtDesc(
                ListingStatus.AVAILABLE,
                Instant.now()
        ).stream()
                .map(ListingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ListingDto> getDonorListings(String donorUsername) {
        User donor = userRepository.findByUsername(donorUsername)
                .orElseThrow(() -> new IllegalArgumentException("Donor user not found: " + donorUsername));

        return listingRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .map(ListingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ListingDto> getRecipientListings(String recipientUsername) {
        User recipient = userRepository.findByUsername(recipientUsername)
                .orElseThrow(() -> new IllegalArgumentException("Recipient user not found: " + recipientUsername));

        return listingRepository.findByRecipientOrderByCreatedAtDesc(recipient).stream()
                .map(ListingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ListingDto createListing(ListingDto dto, String donorUsername) {
        User donor = userRepository.findByUsername(donorUsername)
                .orElseThrow(() -> new IllegalArgumentException("Donor user not found: " + donorUsername));

        if (dto.getExpiresAt() == null || dto.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Expiration time must be in the future.");
        }

        FoodListing listing = new FoodListing(
                dto.getTitle(),
                dto.getDescription(),
                dto.getQuantity(),
                dto.getLocation(),
                dto.getDietaryTags(),
                dto.getExpiresAt(),
                donor
        );

        FoodListing savedListing = listingRepository.save(listing);
        return ListingDto.fromEntity(savedListing);
    }

    @Transactional
    public ListingDto updateListing(Long id, ListingDto dto, String donorUsername) {
        FoodListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with ID: " + id));

        if (!listing.getDonor().getUsername().equals(donorUsername)) {
            throw new SecurityException("You do not own this listing.");
        }

        if (listing.getStatus() != ListingStatus.AVAILABLE) {
            throw new IllegalStateException("Only available listings can be updated.");
        }

        listing.setTitle(dto.getTitle());
        listing.setDescription(dto.getDescription());
        listing.setQuantity(dto.getQuantity());
        listing.setLocation(dto.getLocation());
        listing.setDietaryTags(dto.getDietaryTags());
        
        if (dto.getExpiresAt() != null) {
            if (dto.getExpiresAt().isBefore(Instant.now())) {
                throw new IllegalArgumentException("Expiration time must be in the future.");
            }
            listing.setExpiresAt(dto.getExpiresAt());
        }

        FoodListing updated = listingRepository.save(listing);
        return ListingDto.fromEntity(updated);
    }

    @Transactional
    public void deleteListing(Long id, String donorUsername) {
        FoodListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with ID: " + id));

        if (!listing.getDonor().getUsername().equals(donorUsername)) {
            throw new SecurityException("You do not own this listing.");
        }

        listingRepository.delete(listing);
    }

    @Transactional
    public ListingDto claimListing(Long id, String recipientUsername) {
        FoodListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with ID: " + id));

        if (listing.getStatus() != ListingStatus.AVAILABLE) {
            throw new IllegalStateException("This listing is no longer available.");
        }

        if (listing.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalStateException("This listing has expired.");
        }

        User recipient = userRepository.findByUsername(recipientUsername)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found: " + recipientUsername));

        if (listing.getDonor().getId().equals(recipient.getId())) {
            throw new IllegalArgumentException("You cannot claim your own listing.");
        }

        // Generate a random pickup code e.g. SB-3849
        Random random = new Random();
        int code = 1000 + random.nextInt(9000); // 1000 to 9999
        String pickupCode = "SB-" + code;

        listing.setRecipient(recipient);
        listing.setStatus(ListingStatus.CLAIMED);
        listing.setPickupCode(pickupCode);

        FoodListing claimed = listingRepository.save(listing);
        return ListingDto.fromEntity(claimed);
    }

    @Transactional
    public ListingDto verifyPickupCode(Long id, String pickupCode, String donorUsername) {
        FoodListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with ID: " + id));

        if (!listing.getDonor().getUsername().equals(donorUsername)) {
            throw new SecurityException("You do not own this listing.");
        }

        if (listing.getStatus() != ListingStatus.CLAIMED) {
            throw new IllegalStateException("Listing status is not CLAIMED.");
        }

        if (listing.getPickupCode() == null || !listing.getPickupCode().equalsIgnoreCase(pickupCode.trim())) {
            throw new IllegalArgumentException("Invalid pickup code. Verification failed.");
        }

        listing.setStatus(ListingStatus.COMPLETED);
        
        FoodListing completed = listingRepository.save(listing);
        return ListingDto.fromEntity(completed);
    }
}
