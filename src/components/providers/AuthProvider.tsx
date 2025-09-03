'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { UserWithRoles } from '@/features/auth/services/session';

interface AuthContextType {
  user: UserWithRoles | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: UserWithRoles) => void;
  logout: () => void;
  updateUser: (user: UserWithRoles) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session token on mount
    const storedToken = localStorage.getItem('session_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('session_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: UserWithRoles) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('session_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
  };

  const updateUser = (userData: UserWithRoles) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for getting the current session token
export function useSessionToken() {
  const { token } = useAuth();
  return token;
}

// Hook for checking if user is authenticated
export function useIsAuthenticated() {
  const { user, token } = useAuth();
  return !!(user && token);
}

// Hook for checking if user is admin
export function useIsAdmin() {
  const { user } = useAuth();
  return user?.isAdmin || false;
}

// Hook for checking if user is staff
export function useIsStaff() {
  const { user } = useAuth();
  return user?.isStaff || false;
}
