import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await api.getNotifications();
      setUnreadNotifsCount(data.unreadCount || 0);
    } catch {
      // ignore
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
      refreshNotifications();
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [refreshNotifications]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    setAuthModalOpen(false);
    showToast(`Welcome back, ${data.user.fullName.split(' ')[0]}!`, 'success');
    refreshNotifications();
    return data.user;
  };

  const signup = async (formData) => {
    const data = await api.signup(formData);
    setToken(data.token);
    setUser(data.user);
    setAuthModalOpen(false);
    showToast('Account created successfully! Welcome to TripShare India.', 'success');
    refreshNotifications();
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUnreadNotifsCount(0);
    showToast('You have been logged out.', 'info');
  };

  const openAuth = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuth = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        unreadNotifsCount,
        login,
        signup,
        logout,
        refreshUser,
        refreshNotifications,
        openAuth,
        closeAuth,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
