'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/features/auth/actions/logout';

interface UserNavProps {
  csrfToken?: string | null;
  onLogoutStateChange?: (isLoggingOut: boolean) => void;
}

export default function UserNav({ csrfToken, onLogoutStateChange }: UserNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show immediate visual feedback
    setIsLoggingOut(true);
    setLogoutSuccess(false);
    onLogoutStateChange?.(true);
    
    try {
      // Create form data manually
      const formData = new FormData();
      formData.append('csrf_token', csrfToken || '');
      
      await logoutAction({}, formData);
      // Show success state briefly before redirect
      setLogoutSuccess(true);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setLogoutSuccess(false);
      onLogoutStateChange?.(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <form onSubmit={handleLogout}>
        <Button
          type="submit"
          disabled={isLoggingOut}
          className={`
            group transition-all duration-300 ease-in-out transform
            ${isLoggingOut 
              ? logoutSuccess
                ? 'bg-green-500 cursor-not-allowed opacity-90 scale-95'
                : 'bg-red-400 cursor-not-allowed opacity-70 scale-95'
              : 'bg-red-500 hover:bg-red-600 hover:shadow-lg hover:scale-105 active:scale-95 hover:shadow-red-500/25'
            }
            text-white font-medium
            shadow-sm
            relative overflow-hidden
          `}
          size="sm"
        >
          {isLoggingOut ? (
            logoutSuccess ? (
              <>
                <div className="w-4 h-4 mr-2 rounded-full bg-green-400 animate-pulse" />
                <span className="animate-pulse">Déconnecté!</span>
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="animate-pulse">Déconnexion...</span>
              </>
            )
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-12" />
              Déconnexion
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
