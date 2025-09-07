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
    // Check for existing session on mount by calling server
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setToken('session_exists'); // We don't store the actual token client-side
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = (userData: UserWithRoles) => {
    setToken('session_exists');
    setUser(userData);
    // No localStorage usage - sessions are server-side only
  };

  const logout = async () => {
    try {
      // Call server to destroy session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (userData: UserWithRoles) => {
    setUser(userData);
    // No localStorage usage - user data is fetched from server
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
