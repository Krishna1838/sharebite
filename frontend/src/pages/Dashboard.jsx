import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { Modal } from '../components/Modal';
import { PlusCircle, Search, AlertCircle, Sparkles, Filter, Apple } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  
  // States
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal States
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Create/Edit Form State
  const [formMode, setFormMode] = useState('CREATE'); // CREATE or EDIT
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formLocation, setFormLocation] = useState(user?.businessName ? 'At store location' : '');
  const [expiryHours, setExpiryHours] = useState('4'); // Default expires in 4 hours
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Verification Form State
  const [verificationCode, setVerificationCode] = useState('');
  
  // Recipient Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState('');
  const [claimedCodeToDisplay, setClaimedCodeToDisplay] = useState('');

  // Fetch data on load
  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      if (user.role === 'ROLE_DONOR') {
        const data = await api.listings.getDonorListings();
        setListings(data);
      } else {
        const data = await api.listings.getAvailable();
        setListings(data);
      }
    } catch (err) {
      setError('Could not fetch listings. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [user]);

  // Handle Dietary Tags Toggle
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Open Form for Creation
  const handleOpenCreate = () => {
    setFormMode('CREATE');
    setFormTitle('');
    setFormDesc('');
    setFormQty('');
    setFormLocation('');
    setExpiryHours('4');
    setSelectedTags([]);
    setIsListingModalOpen(true);
  };

  // Open Form for Editing
  const handleOpenEdit = (listing) => {
    setFormMode('EDIT');
    setSelectedListing(listing);
    setFormTitle(listing.title);
    setFormDesc(listing.description);
    setFormQty(listing.quantity);
    setFormLocation(listing.location);
    // Parse tags back
    const tags = listing.dietaryTags 
      ? listing.dietaryTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    setSelectedTags(tags);
    setIsListingModalOpen(true);
  };

  // Handle Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formTitle.trim() || !formQty.trim() || !formLocation.trim()) {
      setError('Please fill in required fields (Title, Quantity, Location).');
      return;
    }

    // Calculate expires_at date based on selected hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(expiryHours));

    const listingPayload = {
      title: formTitle,
      description: formDesc,
      quantity: formQty,
      location: formLocation,
      dietaryTags: selectedTags.join(', '),
      expiresAt: expiresAt.toISOString(),
    };

    try {
      if (formMode === 'CREATE') {
        await api.listings.create(listingPayload);
        setSuccess('Surplus food listed successfully!');
      } else {
        await api.listings.update(selectedListing.id, listingPayload);
        setSuccess('Listing updated successfully!');
      }
      setIsListingModalOpen(false);
      fetchListings();
    } catch (err) {
      setError(err.message || 'Failed to save listing.');
    }
  };

  // Handle Claim (Recipient role)
  const handleClaim = async (id) => {
    setError('');
    try {
      const result = await api.listings.claim(id);
      setClaimedCodeToDisplay(result.pickupCode);
      // Refresh list
      fetchListings();
    } catch (err) {
      setError(err.message || 'Failed to claim food. It might have been claimed already.');
    }
  };

  // Open Code Verification Modal (Donor role)
  const handleOpenVerifyModal = (listing) => {
    setSelectedListing(listing);
    setVerificationCode('');
    setIsVerifyModalOpen(true);
  };

  // Submit Verification Code (Donor role)
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!verificationCode.trim()) {
      setError('Please enter the pickup code.');
      return;
    }

    try {
      await api.listings.verify(selectedListing.id, verificationCode);
      setSuccess('Pickup code verified! Handover completed.');
      setIsVerifyModalOpen(false);
      fetchListings();
    } catch (err) {
      setError(err.message || 'Verification failed. Code may be incorrect.');
    }
  };

  // Handle Delete (Donor role)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setError('');
    try {
      await api.listings.delete(id);
      setSuccess('Listing deleted.');
      fetchListings();
    } catch (err) {
      setError(err.message || 'Failed to delete listing.');
    }
  };

  // Filters for Recipients
  const filteredListings = listings.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const tags = item.dietaryTags 
      ? item.dietaryTags.split(',').map(t => t.trim().toUpperCase()) 
      : [];
      
    const matchesTag = !activeTagFilter || tags.includes(activeTagFilter.toUpperCase());
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="content-wrapper">
      
      {/* Dynamic Alerts */}
      {error && (
        <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a7f3d0' }}>
          <Sparkles size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>
            {user.role === 'ROLE_DONOR' ? 'Your Food Kitchen' : 'Community Pantry'}
          </h1>
          <p>
            {user.role === 'ROLE_DONOR' 
              ? 'List surplus food packages and verify claims from local residents.' 
              : 'Browse and claim free surplus food from local cafes and bakeries.'}
          </p>
        </div>

        {user.role === 'ROLE_DONOR' && (
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>List Surplus Food</span>
          </button>
        )}
      </div>

      {/* Recipient Search & Filters */}
      {user.role === 'ROLE_RECIPIENT' && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flexGrow: 1, position: 'relative', minWidth: '250px' }}>
            <input
              type="text"
              placeholder="Search by food title or pickup location..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} className="text-muted" />
            <button 
              onClick={() => setActiveTagFilter('')} 
              className={`btn btn-secondary ${activeTagFilter === '' ? 'active' : ''}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              All
            </button>
            {['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal'].map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTagFilter(activeTagFilter === tag ? '' : tag)}
                className={`btn btn-secondary ${activeTagFilter === tag ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="empty-state">
          <div style={{ animation: 'spin 2s linear infinite', border: '3px solid rgba(255,255,255,0.05)', borderTop: '3px solid #10b981', borderRadius: '50%', width: '40px', height: '40px', marginBottom: '1rem' }}></div>
          <p>Loading listings...</p>
        </div>
      ) : (user.role === 'ROLE_DONOR' ? listings : filteredListings).length === 0 ? (
        <div className="glass-card empty-state">
          <Apple size={48} />
          <h3>No listings found</h3>
          <p>
            {user.role === 'ROLE_DONOR' 
              ? "You haven't listed any surplus food items yet." 
              : "No available food listings match your filters right now. Check back later!"}
          </p>
          {user.role === 'ROLE_DONOR' && (
            <button onClick={handleOpenCreate} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create Your First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="listings-grid">
          {(user.role === 'ROLE_DONOR' ? listings : filteredListings).map(item => (
            <ListingCard
              key={item.id}
              listing={item}
              onClaim={handleClaim}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onVerify={handleOpenVerifyModal}
            />
          ))}
        </div>
      )}

      {/* Modal 1: Create or Edit Listing Form (Donor Only) */}
      <Modal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        title={formMode === 'CREATE' ? 'List Surplus Food' : 'Edit Food Listing'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Food Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 10 Fresh Croissants, Box of Mixed Salads"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Details</label>
            <textarea
              className="form-input"
              rows="3"
              style={{ resize: 'vertical' }}
              placeholder="Provide pickup details, items description, allergy info, etc."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Quantity *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 5 boxes, 1.5 kg"
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Expires In *</label>
              <select 
                className="form-select"
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="4">4 Hours (Recommended)</option>
                <option value="8">8 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Location *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Provide store address or pick-up instructions"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Dietary Tags</label>
            <div className="tags-checklist">
              {['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal'].map(tag => (
                <label key={tag} className="tag-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsListingModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {formMode === 'CREATE' ? 'Publish Listing' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Verify Claim Pickup Code (Donor Only) */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify Recipient Claim"
      >
        {selectedListing && (
          <form onSubmit={handleVerifySubmit}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Recipient <strong>@{selectedListing.recipientUsername}</strong> claimed <strong>{selectedListing.title}</strong>. 
              Please enter the secure pickup code shown on their device to complete the food share.
            </p>
            
            <div className="verification-box">
              <div className="verification-title">
                <Apple size={16} />
                <span>Verify Pickup Handover</span>
              </div>
              <div className="verification-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SB-1294"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', fontSize: '1.1rem', textAlign: 'center' }}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  autoFocus
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Verify & Handover
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal 3: Display Pickup Code to Recipient (Recipient Only) */}
      <Modal
        isOpen={!!claimedCodeToDisplay}
        onClose={() => setClaimedCodeToDisplay('')}
        title="Food Claimed Successfully!"
      >
        <div style={{ textAlignment: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Your claim is reserved. Show this code to the vendor at the pickup location to collect your food:
          </p>
          
          <div className="pickup-code-display">
            <div className="pickup-code-title">Pickup Verification Code</div>
            <div className="pickup-code-value">{claimedCodeToDisplay}</div>
          </div>
          
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            * Note: You can view this code anytime under the <strong>My Claims</strong> tab.
          </p>

          <button 
            onClick={() => setClaimedCodeToDisplay('')} 
            className="btn btn-primary" 
            style={{ width: '100%' }}
          >
            Got It, Thanks!
          </button>
        </div>
      </Modal>

    </div>
  );
};
