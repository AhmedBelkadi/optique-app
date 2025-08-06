'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { generateCSRFToken } from '@/lib/csrf-client';
import React from 'react';

interface CSRFContextType {
  csrfToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined);

interface CSRFProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function useCSRF() {
  const context = useContext(CSRFContext);
  if (context === undefined) {
    throw new Error('useCSRF must be used within a CSRFProvider');
  }
  return context;
}

export default function CSRFProvider({ children, fallback }: CSRFProviderProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCSRFToken() {
      try {
        const token = await generateCSRFToken();
        setCsrfToken(token);
      } catch (err) {
        console.error('Failed to load CSRF token:', err);
        setError('Failed to load security token');
      } finally {
        setIsLoading(false);
      }
    }

    loadCSRFToken();
  }, []);

  // Always render children, even during loading or error states
  return (
    <CSRFContext.Provider value={{ csrfToken, isLoading, error }}>
      {children}
    </CSRFContext.Provider>
  );
} 