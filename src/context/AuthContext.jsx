import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('tablemint_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tablemint_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    // data = { token, user }
    localStorage.setItem('tablemint_token', data.token);
    localStorage.setItem('tablemint_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tablemint_token');
    localStorage.removeItem('tablemint_user');
    setToken(null);
    setUser(null);
  }, []);

  // Auto logout if API returns 401
  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('tablemint:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('tablemint:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}