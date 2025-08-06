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
    // Convert hex to HSL (simplified)
    const hex = event.target.value;
    // For now, just use the hex value
    // In a real implementation, you'd convert hex to HSL
    onChange(hex);
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
          variant="outline"
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
            value={value?.startsWith('#') ? value : '#000000'}
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