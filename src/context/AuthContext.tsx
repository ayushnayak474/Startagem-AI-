import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

export interface User {
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  roleTitle?: string;
  defaultRiskAppetite: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    organization?: string;
    roleTitle?: string;
    defaultRiskAppetite?: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    fullName: string;
    organization?: string;
    roleTitle?: string;
    defaultRiskAppetite: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('stratagem_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('stratagem_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('stratagem_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('stratagem_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing auth state');
          localStorage.removeItem('stratagem_token');
          localStorage.removeItem('stratagem_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('stratagem_token', res.data.token);
      localStorage.setItem('stratagem_user', JSON.stringify(res.data.user));
    } else {
      throw new Error(res.error || 'Login failed');
    }
  };

  const demoLogin = async () => {
    const res = await authAPI.demoLogin();
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('stratagem_token', res.data.token);
      localStorage.setItem('stratagem_user', JSON.stringify(res.data.user));
    } else {
      throw new Error(res.error || 'Demo login failed');
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    organization?: string;
    roleTitle?: string;
    defaultRiskAppetite?: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  }) => {
    const res = await authAPI.register(data);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('stratagem_token', res.data.token);
      localStorage.setItem('stratagem_user', JSON.stringify(res.data.user));
    } else {
      throw new Error(res.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('stratagem_token');
    localStorage.removeItem('stratagem_user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  const updateProfile = async (data: {
    fullName: string;
    organization?: string;
    roleTitle?: string;
    defaultRiskAppetite: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  }) => {
    const res = await authAPI.updateProfile(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('stratagem_user', JSON.stringify(res.data.user));
    } else {
      throw new Error(res.error || 'Profile update failed');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('stratagem_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
