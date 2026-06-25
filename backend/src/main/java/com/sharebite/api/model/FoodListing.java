package com.sharebite.api.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "food_listings")
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String quantity;

    @Column(nullable = false)
    private String location;

    @Column(name = "dietary_tags")
    private String dietaryTags; // Comma separated tags e.g. "VEGAN, GLUTEN_FREE"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "pickup_code")
    private String pickupCode; // Secure code generated when claimed (e.g., SB-1094)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    // Constructors
    public FoodListing() {
        this.status = ListingStatus.AVAILABLE;
        this.createdAt = Instant.now();
    }

    public FoodListing(String title, String description, String quantity, String location, String dietaryTags, Instant expiresAt, User donor) {
        this.title = title;
        this.description = description;
        this.quantity = quantity;
        this.location = location;
        this.dietaryTags = dietaryTags;
        this.expiresAt = expiresAt;
        this.donor = donor;
        this.status = ListingStatus.AVAILABLE;
        this.createdAt = Instant.now();
    }

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

    public ListingStatus getStatus() {
        return status;
    }

    public void setStatus(ListingStatus status) {
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

    public User getDonor() {
        return donor;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }
}
