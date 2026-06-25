import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, Package, Check, Trash2, Edit3, Key, Store } from 'lucide-react';

export const ListingCard = ({ listing, onClaim, onEdit, onDelete, onVerify }) => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Parse dietary tags into an array
  const tags = listing.dietaryTags 
    ? listing.dietaryTags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  // Recalculate expiry countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(listing.expiresAt) - new Date();
      if (difference <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (hours > 0) {
        setTimeLeft(`Expires in ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`Expires in ${minutes}m`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [listing.expiresAt]);

  const getDietaryClass = (tag) => {
    const normalized = tag.toUpperCase().replace('_', '-');
    if (normalized === 'VEGAN') return 'tag-vegan';
    if (normalized === 'VEGETARIAN') return 'tag-vegetarian';
    if (normalized === 'GLUTEN-FREE') return 'tag-gluten-free';
    if (normalized === 'HALAL') return 'tag-halal';
    return 'tag-other';
  };

  const getStatusClass = (status) => {
    if (status === 'AVAILABLE') return 'status-available';
    if (status === 'CLAIMED') return 'status-claimed';
    return 'status-completed';
  };

  const isOwner = user?.role === 'ROLE_DONOR' && user?.id === listing.donorId;
  const isClaimer = user?.role === 'ROLE_RECIPIENT' && user?.id === listing.recipientId;

  return (
    <div className="glass-card listing-card">
      <div className="listing-badge-container">
        <span className={`status-badge ${getStatusClass(listing.status)}`}>
          {listing.status.toLowerCase()}
        </span>
        
        {listing.status === 'AVAILABLE' && (
          <span className={`expiry-countdown ${isExpired ? 'expiry-expired' : ''}`}>
            <Clock size={14} />
            <span>{timeLeft}</span>
          </span>
        )}
      </div>

      <h3 className="listing-title">{listing.title}</h3>
      
      <div className="listing-donor">
        <Store size={14} />
        <span>{listing.businessName || listing.donorUsername}</span>
      </div>

      {tags.length > 0 && (
        <div className="tag-list">
          {tags.map((tag, idx) => (
            <span key={idx} className={`dietary-tag ${getDietaryClass(tag)}`}>
              {tag.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}

      <p className="listing-desc">{listing.description}</p>

      <div className="listing-info-row">
        <div className="info-item">
          <Package size={14} />
          <span><strong>Quantity:</strong> {listing.quantity}</span>
        </div>
        <div className="info-item">
          <MapPin size={14} />
          <span><strong>Location:</strong> {listing.location}</span>
        </div>
      </div>

      <div className="listing-actions">
        {/* Recipient User Actions */}
        {user?.role === 'ROLE_RECIPIENT' && (
          <>
            {listing.status === 'AVAILABLE' && (
              <button 
                onClick={() => onClaim(listing.id)} 
                className="btn btn-primary"
                disabled={isExpired}
              >
                Claim Surplus Food
              </button>
            )}
            {listing.status === 'CLAIMED' && isClaimer && (
              <button 
                onClick={() => onVerify(listing)} 
                className="btn btn-secondary"
                style={{ border: '1px dashed #60a5fa', color: '#60a5fa' }}
              >
                <Key size={16} />
                <span>Show Pickup Code</span>
              </button>
            )}
          </>
        )}

        {/* Donor User Actions (Owner of listing) */}
        {isOwner && (
          <>
            {listing.status === 'AVAILABLE' && (
              <>
                <button 
                  onClick={() => onEdit(listing)} 
                  className="btn btn-secondary"
                  style={{ flexGrow: 1 }}
                >
                  <Edit3 size={16} />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => onDelete(listing.id)} 
                  className="btn btn-danger"
                  style={{ padding: '0.75rem', flexGrow: 0 }}
                  title="Delete Listing"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {listing.status === 'CLAIMED' && (
              <button 
                onClick={() => onVerify(listing)} 
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', boxShadow: 'none' }}
              >
                <Check size={16} />
                <span>Verify Pickup Code</span>
              </button>
            )}
            {listing.status === 'COMPLETED' && (
              <button 
                className="btn btn-secondary" 
                disabled 
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                Completed & Shared
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
