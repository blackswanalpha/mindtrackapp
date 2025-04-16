'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';

// Define user type
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_image?: string;
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state with a mock user
  useEffect(() => {
    // AUTHENTICATION DISABLED: Always provide a mock user
    const mockUser: User = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };

    setUser(mockUser);
    setToken('mock-token-12345');

    // Set mock data in localStorage for consistency
    localStorage.setItem('token', 'mock-token-12345');
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Always set loading to false
    setIsLoading(false);
  }, []);

  // Login function (disabled - always succeeds with mock user)
  const login = async (_email: string, _password: string) => {
    // AUTHENTICATION DISABLED: Always succeed with mock user
    const mockUser: User = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };

    setToken('mock-token-12345');
    setUser(mockUser);
    localStorage.setItem('token', 'mock-token-12345');
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call register API
      const response = await api.auth.register(name, email, password);

      // Save token and user to state and localStorage
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token and user from state and localStorage
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
