import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Apple, LogOut, LayoutDashboard, History, User } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Apple size={28} style={{ fill: '#34d399', stroke: '#10b981' }} />
        <span>ShareBite</span>
      </div>

      <div className="nav-links">
        <button 
          onClick={() => setCurrentTab('dashboard')} 
          className={`nav-link btn-text ${currentTab === 'dashboard' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
        </button>

        {user.role === 'ROLE_RECIPIENT' && (
          <button 
            onClick={() => setCurrentTab('my-claims')} 
            className={`nav-link btn-text ${currentTab === 'my-claims' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} />
              <span>My Claims</span>
            </div>
          </button>
        )}
      </div>

      <div className="nav-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={16} className="text-secondary" />
          <span style={{ fontWeight: 500 }}>
            {user.role === 'ROLE_DONOR' ? user.businessName : user.username}
          </span>
          <span className="user-badge">
            {user.role === 'ROLE_DONOR' ? 'Donor' : 'Recipient'}
          </span>
        </div>

        <button 
          onClick={logout} 
          className="btn btn-secondary" 
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          title="Sign Out"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};
