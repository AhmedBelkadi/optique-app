'use client';

import { useEffect } from 'react';

interface ThemeProviderProps {
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export default function ThemeProvider({ 
  primaryColor, 
  secondaryColor 
}: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    
    // Set primary color with fallback
    const primaryValue = primaryColor || '222.2 47.4% 11.2%';
    root.style.setProperty('--primary', primaryValue);
    
    // Set secondary color with fallback
    const secondaryValue = secondaryColor || '210 40% 96%';
    root.style.setProperty('--secondary', secondaryValue);
    
    // Also set the foreground colors for better contrast
    root.style.setProperty('--primary-foreground', '210 40% 98%');
    root.style.setProperty('--secondary-foreground', '222.2 84% 4.9%');
  }, [primaryColor, secondaryColor]);

  return null;
} 