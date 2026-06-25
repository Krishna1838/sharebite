import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MyClaims } from './pages/MyClaims';
import { Apple } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  
  // Navigation state
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' or 'my-claims'

  // Loading Screen
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '1rem', background: '#090a0f' }}>
        <div style={{ animation: 'spin 1.5s linear infinite', border: '3px solid rgba(255,255,255,0.05)', borderTop: '3px solid #10b981', borderRadius: '50%', width: '45px', height: '45px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 600 }}>
          <Apple size={18} style={{ fill: '#34d399', stroke: '#10b981' }} />
          <span>ShareBite</span>
        </div>
      </div>
    );
  }

  // Not Logged In - Render Auth Screen
  if (!user) {
    return authView === 'login' 
      ? <Login onNavigateToRegister={() => setAuthView('register')} />
      : <Register onNavigateToLogin={() => setAuthView('login')} />;
  }

  // Logged In - Render Main Dashboard Layout
  return (
    <div className="app-container">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {currentTab === 'dashboard' ? (
        <Dashboard />
      ) : (
        <MyClaims />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
