package com.sharebite.api.dto;

import com.sharebite.api.model.FoodListing;
import java.time.Instant;

public class ListingDto {

    private Long id;
    private String title;
    private String description;
    private String quantity;
    private String location;
    private String dietaryTags;
    private String status;
    private Instant expiresAt;
    private Instant createdAt;
    private String pickupCode;
    
    private Long donorId;
    private String donorUsername;
    private String businessName;
    
    private Long recipientId;
    private String recipientUsername;

    // Static mapping helper to convert database Entity to DTO
    public static ListingDto fromEntity(FoodListing listing) {
        ListingDto dto = new ListingDto();
        dto.setId(listing.getId());
        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());
        dto.setQuantity(listing.getQuantity());
        dto.setLocation(listing.getLocation());
        dto.setDietaryTags(listing.getDietaryTags());
        dto.setStatus(listing.getStatus().name());
        dto.setExpiresAt(listing.getExpiresAt());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setPickupCode(listing.getPickupCode());
        
        if (listing.getDonor() != null) {
            dto.setDonorId(listing.getDonor().getId());
            dto.setDonorUsername(listing.getDonor().getUsername());
            dto.setBusinessName(listing.getDonor().getBusinessName());
        }
        
        if (listing.getRecipient() != null) {
            dto.setRecipientId(listing.getRecipient().getId());
            dto.setRecipientUsername(listing.getRecipient().getUsername());
        }
        
        return dto;
    }

    // Constructors
    public ListingDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDietaryTags() {
        return dietaryTags;
    }

    public void setDietaryTags(String dietaryTags) {
        this.dietaryTags = dietaryTags;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getPickupCode() {
        return pickupCode;
    }

    public void setPickupCode(String pickupCode) {
        this.pickupCode = pickupCode;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public String getDonorUsername() {
        return donorUsername;
    }

    public void setDonorUsername(String donorUsername) {
        this.donorUsername = donorUsername;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }
}
