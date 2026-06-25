import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('sharebite_token');
      if (token) {
        try {
          const userData = await api.auth.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Token verification failed, logging out.", error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const authData = await api.auth.login(username, password);
      // Store JWT token securely in localStorage
      localStorage.setItem('sharebite_token', authData.token);
      
      const userData = {
        id: authData.id,
        username: authData.username,
        email: authData.email,
        role: authData.role,
        businessName: authData.businessName
      };
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const result = await api.auth.signup(userData);
      return result;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sharebite_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
