'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

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

export default function ColorPicker({
  label,
  value,
  onChange,
  placeholder = "Enter HSL color (e.g., 220 13% 18%)"
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Convert hex to HSL and save in HSL format
    const hex = event.target.value;
    const hsl = hexToHsl(hex);
    onChange(hsl);
  };

  const getBackgroundColor = () => {
    if (!value) return 'transparent';
    
    // If it's already HSL format, convert to CSS
    if (value.includes(' ')) {
      return `hsl(${value})`;
    }
    
    // If it's hex, use as is
    if (value.startsWith('#')) {
      return value;
    }
    
    return 'transparent';
  };

  // Convert current value to hex for the color picker
  const getHexValue = () => {
    if (!value) return '#000000';
    
    // If it's HSL, we'd need to convert back to hex
    // For simplicity, just use a default
    if (value.includes(' ')) {
      return '#000000'; // We'll improve this later
    }
    
    // If it's already hex, use as is
    if (value.startsWith('#')) {
      return value;
    }
    
    return '#000000';
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={handleInputChange}
          className="flex-1"
        />
        
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => setShowPicker(!showPicker)}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      {showPicker && (
        <div className="flex gap-2 items-center">
          <Input
            type="color"
            value={getHexValue()}
            onChange={handleColorChange}
            className="w-12 h-10 p-1"
          />
          <div 
            className="w-8 h-8 border rounded"
            style={{ backgroundColor: getBackgroundColor() }}
          />
        </div>
      )}

      {value && (
        <div className="text-xs text-muted-foreground">
          Preview: <span style={{ color: getBackgroundColor() }}>Sample Text</span>
        </div>
      )}
    </div>
  );
} 