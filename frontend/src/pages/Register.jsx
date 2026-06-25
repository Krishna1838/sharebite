import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Apple, Lock, User, Mail, AlertCircle, ShoppingBag, Heart, Building2 } from 'lucide-react';

export const Register = ({ onNavigateToLogin }) => {
  const { signup, login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_RECIPIENT'); // Default to Recipient
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (role === 'ROLE_DONOR' && !businessName.trim()) {
      setError('Please provide a Business/Organization Name.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        username,
        email,
        password,
        role,
        businessName: role === 'ROLE_DONOR' ? businessName : null
      });

      setSuccess('Account created successfully! Logging you in...');
      
      // Auto login after successful signup
      setTimeout(async () => {
        try {
          await login(username, password);
        } catch (loginErr) {
          onNavigateToLogin();
        }
      }, 1500);

    } catch (err) {
      setError(err.message || 'Registration failed. Username or email might be taken.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--glow-grad)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Apple size={36} style={{ fill: '#34d399', stroke: '#10b981' }} />
          </div>
          <h2>Join ShareBite</h2>
          <p>Create an account to reduce food waste together</p>
        </div>

        {error && (
          <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: '0.9rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a7f3d0', fontSize: '0.9rem' }}>
            <Apple size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Custom Card Toggle Selector for Role */}
          <div className="form-group">
            <label className="form-label">I want to join as a:</label>
            <div className="role-selector">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="ROLE_RECIPIENT"
                  checked={role === 'ROLE_RECIPIENT'}
                  onChange={() => setRole('ROLE_RECIPIENT')}
                  disabled={loading}
                />
                <div className="role-card">
                  <Heart size={20} className={role === 'ROLE_RECIPIENT' ? 'text-primary' : 'text-muted'} />
                  <h3>Recipient</h3>
                  <p>Claim food</p>
                </div>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="ROLE_DONOR"
                  checked={role === 'ROLE_DONOR'}
                  onChange={() => setRole('ROLE_DONOR')}
                  disabled={loading}
                />
                <div className="role-card">
                  <ShoppingBag size={20} className={role === 'ROLE_DONOR' ? 'text-primary' : 'text-muted'} />
                  <h3>Donor</h3>
                  <p>Share food</p>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                id="username"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <User size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Mail size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Lock size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Conditional field for Donors */}
          {role === 'ROLE_DONOR' && (
            <div className="form-group" style={{ animation: 'slideUp 0.3s ease-out' }}>
              <label className="form-label" htmlFor="businessName">Bakery / Business / Organization Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="businessName"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Daily Crust Bakery"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={loading}
                />
                <Building2 size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem', marginTop: '1.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};
