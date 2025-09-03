'use client';

import { useEffect, useState, createContext, useContext, useRef } from 'react';
import { generateCSRFToken, getCurrentCSRFToken } from '@/lib/csrf-client';
import React from 'react';

interface CSRFContextType {
  csrfToken: string | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
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
  const [retryCount, setRetryCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);
  const lastAttemptTime = useRef<number>(0);

  const retry = () => {
    setRetryCount(0);
    setIsLoading(true);
    setError(null);
    setCsrfToken(null);
    hasInitialized.current = false;
    lastAttemptTime.current = 0;
  };

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) {
      return;
    }

    // If we already have a token, don't try to generate another one
    if (csrfToken) {
      hasInitialized.current = true;
      return;
    }

    // If we're already generating a token, don't start another one
    if (isGenerating) {
      return;
    }

    // If we've reached max retries and have an error, don't try again
    if (retryCount >= 2 && error) {
      return;
    }

    // Prevent rapid retries - wait at least 5 seconds between attempts
    const now = Date.now();
    if (now - lastAttemptTime.current < 5000) {
      return;
    }
    lastAttemptTime.current = now;

    hasInitialized.current = true;

    // First, check if we already have a token in cookies
    const existingToken = getCurrentCSRFToken();
    
    if (existingToken) {
      setCsrfToken(existingToken);
      setIsLoading(false);
      return;
    }

    async function loadCSRFToken() {
      // Prevent multiple simultaneous token generation attempts
      if (isGenerating) {
        return;
      }

      setIsGenerating(true);
      try {
        const token = await generateCSRFToken();
        setCsrfToken(token);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error('CSRFProvider: Failed to load CSRF token:', err);
        setError('Failed to load security token');
        
        // Retry logic (max 3 attempts)
        if (retryCount < 2) {
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            hasInitialized.current = false; // Allow retry
          }, 5000); // Increased delay to 5 seconds
        } else {
          // Max retries reached, stop loading and show error
          setIsLoading(false);
          setError('Failed to load security token after multiple attempts. Please refresh the page.');
        }
      } finally {
        setIsGenerating(false);
      }
    }

    // Add a timeout to prevent infinite loading
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    loadCSRFToken();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      hasInitialized.current = false;
    };
  }, [retryCount]); // Only depend on retryCount

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      hasInitialized.current = false;
    };
  }, []);

  // Always render children, even during loading or error states
  return (
    <CSRFContext.Provider value={{ csrfToken, isLoading, error, retry }}>
      {children}
    </CSRFContext.Provider>
  );
} 