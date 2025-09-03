'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Palette, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface ColorPreviewProps {
  title: string;
  description?: string;
  colors: {
    name: string;
    value: string;
    label: string;
    type: 'primary' | 'secondary' | 'accent' | 'background' | 'text' | 'status';
  }[];
  onColorChange: (name: string, value: string) => void;
}

export default function ColorPreview({ title, description, colors, onColorChange }: ColorPreviewProps) {
  const [showPreview, setShowPreview] = useState(true);

  const getPreviewElement = (color: typeof colors[0]) => {
    const colorValue = color.value || '#000000';
    
    switch (color.type) {
      case 'primary':
        return (
          <div className="space-y-2">
            <Button style={{ backgroundColor: colorValue, color: getContrastColor(colorValue) }}>
              Primary Button
            </Button>
            <Badge style={{ backgroundColor: colorValue, color: getContrastColor(colorValue) }}>
              Primary Badge
            </Badge>
          </div>
        );
      
      case 'secondary':
        return (
          <div className="space-y-2">
            <Button variant="outline" style={{ borderColor: colorValue, color: colorValue }}>
              Secondary Button
            </Button>
            <Badge variant="outline" style={{ borderColor: colorValue, color: colorValue }}>
              Secondary Badge
            </Badge>
          </div>
        );
      
      case 'accent':
        return (
          <div className="space-y-2">
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: colorValue }} />
            <div className="h-2 w-16 rounded" style={{ backgroundColor: colorValue }} />
          </div>
        );
      
      case 'background':
        return (
          <div className="space-y-2">
            <div className="h-12 w-20 rounded border" style={{ backgroundColor: colorValue }} />
            <div className="h-8 w-16 rounded" style={{ backgroundColor: colorValue }} />
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2">
            <p style={{ color: colorValue }} className="text-sm font-medium">
              Sample Text
            </p>
            <span style={{ color: colorValue }} className="text-xs">
              Small text
            </span>
          </div>
        );
      
      case 'status':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {color.name.includes('success') && <CheckCircle className="h-4 w-4" style={{ color: colorValue }} />}
              {color.name.includes('warning') && <AlertTriangle className="h-4 w-4" style={{ color: colorValue }} />}
              {color.name.includes('error') && <XCircle className="h-4 w-4" style={{ color: colorValue }} />}
              {color.name.includes('info') && <Info className="h-4 w-4" style={{ color: colorValue }} />}
              <span style={{ color: colorValue }} className="text-sm">
                {color.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-8 w-16 rounded" style={{ backgroundColor: colorValue }} />
        );
    }
  };

  const getContrastColor = (hexColor: string) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? 'Hide' : 'Show'} Preview
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Controls */}
          <div className="space-y-4">
            {colors.map((color) => (
              <div key={color.name} className="space-y-2">
                <Label htmlFor={color.name} className="text-sm font-medium">
                  {color.label}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={color.name}
                    value={color.value}
                    onChange={(e) => onColorChange(color.name, e.target.value)}
                    placeholder="Enter hex color (e.g., #3b82f6)"
                    className="flex-1"
                  />
                  <div
                    className="w-10 h-10 rounded border cursor-pointer"
                    style={{ backgroundColor: color.value || '#000000' }}
                    onClick={() => {
                      const input = document.getElementById(color.name) as HTMLInputElement;
                      if (input) input.focus();
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Live Preview</span>
              </div>
              <Separator />
              <div className="space-y-4">
                {colors.map((color) => (
                  <div key={color.name} className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      {color.label}
                    </Label>
                    <div className="p-3 rounded border bg-card">
                      {getPreviewElement(color)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
