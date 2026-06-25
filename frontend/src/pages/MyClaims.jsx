import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { Modal } from '../components/Modal';
import { History, Heart, AlertCircle, Key } from 'lucide-react';

export const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listings.getRecipientListings();
      setClaims(data);
    } catch (err) {
      setError('Could not load claims. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleShowCode = (claim) => {
    setSelectedClaim(claim);
    setIsCodeModalOpen(true);
  };

  // Separate claims into active and completed
  const activeClaims = claims.filter(c => c.status === 'CLAIMED');
  const pastClaims = claims.filter(c => c.status === 'COMPLETED');

  return (
    <div className="content-wrapper">
      
      {error && (
        <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div className="dashboard-title">
          <h1>My Food Claims</h1>
          <p>Track your claimed surplus food and show pickup codes at the counter.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div style={{ animation: 'spin 2s linear infinite', border: '3px solid rgba(255,255,255,0.05)', borderTop: '3px solid #10b981', borderRadius: '50%', width: '40px', height: '40px', marginBottom: '1rem' }}></div>
          <p>Loading your claims...</p>
        </div>
      ) : claims.length === 0 ? (
        <div className="glass-card empty-state">
          <Heart size={48} />
          <h3>No claims yet</h3>
          <p>You haven't claimed any surplus food packages. Go to the dashboard to find available food!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Active Claims Section */}
          {activeClaims.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={20} />
                <span>Active Claims (Ready for Pickup)</span>
              </h2>
              <div className="listings-grid">
                {activeClaims.map(claim => (
                  <ListingCard
                    key={claim.id}
                    listing={claim}
                    onVerify={handleShowCode} // Reuse verify callback to show code
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Claims Section */}
          {pastClaims.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={20} />
                <span>Claim History (Completed)</span>
              </h2>
              <div className="listings-grid">
                {pastClaims.map(claim => (
                  <ListingCard
                    key={claim.id}
                    listing={claim}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Code Display Modal */}
      <Modal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        title="Pickup Verification"
      >
        {selectedClaim && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Present this pickup code to <strong>{selectedClaim.businessName || selectedClaim.donorUsername}</strong> at 
              the pickup location: <strong>{selectedClaim.location}</strong>.
            </p>
            
            <div className="pickup-code-display">
              <div className="pickup-code-title">Verification Code</div>
              <div className="pickup-code-value">{selectedClaim.pickupCode}</div>
            </div>
            
            <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'left' }}>
              <strong>Item Details:</strong><br />
              🎁 {selectedClaim.title}<br />
              📦 Quantity: {selectedClaim.quantity}<br />
              📍 Address: {selectedClaim.location}
            </div>

            <button 
              onClick={() => setIsCodeModalOpen(false)} 
              className="btn btn-primary" 
              style={{ width: '100%' }}
            >
              Done
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};
