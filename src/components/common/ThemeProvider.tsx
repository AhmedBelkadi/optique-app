'use client';

import { useEffect } from 'react';

// Helper function to convert hex to HSL
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  // Convert to degrees and percentages
  const hue = Math.round(h * 360);
  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);
  
  return `${hue} ${saturation}% ${lightness}%`;
}

// Helper function to check if a color is hex
function isHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

interface ThemeProviderProps {
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

// Helper function to set CSS variable with fallback
function setCSSVariable(
  root: HTMLElement, 
  variableName: string, 
  value: string | null, 
  defaultValue: string
) {
  if (value) {
    // Convert hex to HSL if the value is a hex color
    const finalValue = isHexColor(value) ? hexToHsl(value) : value;
    root.style.setProperty(variableName, finalValue);
  } else {
    root.style.setProperty(variableName, defaultValue);
  }
}

export default function ThemeProvider({ 
  primaryColor = null,
  secondaryColor = null,
}: ThemeProviderProps) {
  useEffect(() => {
    console.log('ThemeProvider: useEffect triggered with props:', {
      primaryColor,
      secondaryColor,
    });
    
    const root = document.documentElement;
    
    // Set Core Theme Colors with smart defaults
    setCSSVariable(root, '--primary', primaryColor, '222.2 47.4% 11.2%');
    setCSSVariable(root, '--secondary', secondaryColor, '210 40% 96%');
    
    // Calculate and set foreground colors for better contrast
    const primaryValue = primaryColor || '222.2 47.4% 11.2%';
    const primaryHsl = isHexColor(primaryValue) ? hexToHsl(primaryValue) : primaryValue;
    const primaryHslParts = primaryHsl.split(' ');
    const primaryLightness = parseFloat(primaryHslParts[2]);
    const primaryForeground = primaryLightness > 50 ? '222.2 84% 4.9%' : '210 40% 98%';
    
    const secondaryValue = secondaryColor || '210 40% 96%';
    const secondaryHsl = isHexColor(secondaryValue) ? hexToHsl(secondaryValue) : secondaryValue;
    const secondaryHslParts = secondaryHsl.split(' ');
    const secondaryLightness = parseFloat(secondaryHslParts[2]);
    const secondaryForeground = secondaryLightness > 50 ? '222.2 84% 4.9%' : '210 40% 98%';
    
    root.style.setProperty('--primary-foreground', primaryForeground);
    root.style.setProperty('--secondary-foreground', secondaryForeground);
    
    // Debug: Log the actual values being set in development
    if (process.env.NODE_ENV === 'development') {
      console.log('ThemeProvider: Setting CSS variables:', {
        '--primary': primaryColor,
        '--secondary': secondaryColor,
      });
      
      // Also log the converted HSL values
      console.log('ThemeProvider: Converted HSL values:', {
        '--primary': isHexColor(primaryColor || '') ? hexToHsl(primaryColor!) : primaryColor,
        '--secondary': isHexColor(secondaryColor || '') ? hexToHsl(secondaryColor!) : secondaryColor,
      });
    }
  }, [primaryColor, secondaryColor]);

  return null;
} 