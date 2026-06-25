package com.sharebite.api.repository;

import com.sharebite.api.model.FoodListing;
import com.sharebite.api.model.ListingStatus;
import com.sharebite.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {
    
    // Find all listings that are AVAILABLE and have not yet expired
    List<FoodListing> findByStatusAndExpiresAtAfterOrderByCreatedAtDesc(ListingStatus status, Instant dateTime);
    
    // Find listings created by a donor
    List<FoodListing> findByDonorOrderByCreatedAtDesc(User donor);
    
    // Find listings claimed by a recipient
    List<FoodListing> findByRecipientOrderByCreatedAtDesc(User recipient);
}
