import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(window.location.hash?.includes('session_id=') ? null : null);

  const checkAuth = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      setUser(false);
    }
  }, []);

  useEffect(() => {
    // Beim Google-Rückkehr-Callback übernimmt AuthCallback die Anmeldung zuerst.
    if (window.location.hash?.includes('session_id=')) return;
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => { const u = await api.login(email, password); setUser(u); return u; };
  const register = async (email, password, name) => { const u = await api.register(email, password, name); setUser(u); return u; };
  const logout = async () => { try { await api.logout(); } finally { setUser(false); } };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser, refresh: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
