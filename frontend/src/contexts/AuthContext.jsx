import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // --- MODIFICATION: Corrected the API endpoint path ---
        const { data } = await apiClient.get('/auth/me'); 
        
        setUser(data);
        if (data.email.startsWith('admin@')) {
          setIsAdmin(true);
        }
      } catch (error) {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const loginAction = (loginData) => {
    setUser(loginData.user);
    if (loginData.user.email.startsWith('admin@')) {
      setIsAdmin(true);
    }
  };

  const logOut = async () => {
    try {
        // --- MODIFICATION: Corrected the API endpoint path ---
        await apiClient.post('/auth/logout');
    } finally {
        setUser(null);
        setIsAdmin(false);
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    loginAction,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
