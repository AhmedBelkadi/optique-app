'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Moon, Sun, Zap, Heart, Star } from 'lucide-react';

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    cardBackgroundColor: string;
    foregroundColor: string;
    mutedBackgroundColor: string;
    mutedForegroundColor: string;
    borderColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
    infoColor: string;
  };
  tags: string[];
}

const themePresets: ThemePreset[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Professional and trustworthy blue theme',
    icon: Palette,
    colors: {
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#f8fafc',
      foregroundColor: '#0f172a',
      mutedBackgroundColor: '#f1f5f9',
      mutedForegroundColor: '#64748b',
      borderColor: '#e2e8f0',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
    },
    tags: ['Professional', 'Trust', 'Modern'],
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    description: 'Friendly and approachable warm theme',
    icon: Sun,
    colors: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      accentColor: '#10b981',
      backgroundColor: '#fefce8',
      cardBackgroundColor: '#fef3c7',
      foregroundColor: '#451a03',
      mutedBackgroundColor: '#fef3c7',
      mutedForegroundColor: '#92400e',
      borderColor: '#fbbf24',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
    },
    tags: ['Warm', 'Friendly', 'Approachable'],
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Sophisticated and creative purple theme',
    icon: Star,
    colors: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#a855f7',
      accentColor: '#ec4899',
      backgroundColor: '#faf5ff',
      cardBackgroundColor: '#f3e8ff',
      foregroundColor: '#2e1065',
      mutedBackgroundColor: '#ede9fe',
      mutedForegroundColor: '#6b21a8',
      borderColor: '#c4b5fd',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
    },
    tags: ['Elegant', 'Creative', 'Sophisticated'],
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    description: 'Fresh and organic green theme',
    icon: Heart,
    colors: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#3b82f6',
      backgroundColor: '#f0fdf4',
      cardBackgroundColor: '#dcfce7',
      foregroundColor: '#14532d',
      mutedBackgroundColor: '#d1fae5',
      mutedForegroundColor: '#047857',
      borderColor: '#86efac',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
    },
    tags: ['Nature', 'Fresh', 'Organic'],
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Modern dark theme for better contrast',
    icon: Moon,
    colors: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#10b981',
      backgroundColor: '#0f172a',
      cardBackgroundColor: '#1e293b',
      foregroundColor: '#f8fafc',
      mutedBackgroundColor: '#334155',
      mutedForegroundColor: '#94a3b8',
      borderColor: '#475569',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
    },
    tags: ['Dark', 'Modern', 'Contrast'],
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    description: 'Clean and minimal gray theme',
    icon: Zap,
    colors: {
      primaryColor: '#6b7280',
      secondaryColor: '#9ca3af',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#f9fafb',
      foregroundColor: '#111827',
      mutedBackgroundColor: '#f3f4f6',
      mutedForegroundColor: '#6b7280',
      borderColor: '#d1d5db',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
    },
    tags: ['Minimal', 'Clean', 'Professional'],
  },
];

interface ThemePresetsProps {
  onApplyPreset: (preset: ThemePreset) => void;
  currentTheme?: Partial<ThemePreset['colors']>;
}

export default function ThemePresets({ onApplyPreset, currentTheme }: ThemePresetsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const getThemeSimilarity = (preset: ThemePreset) => {
    if (!currentTheme) return 0;
    
    let matches = 0;
    let total = 0;
    
    Object.entries(preset.colors).forEach(([key, value]) => {
      if (currentTheme[key as keyof typeof currentTheme]) {
        total++;
        if (currentTheme[key as keyof typeof currentTheme] === value) {
          matches++;
        }
      }
    });
    
    return total > 0 ? (matches / total) * 100 : 0;
  };

  const sortedPresets = [...themePresets].sort((a, b) => {
    const similarityA = getThemeSimilarity(a);
    const similarityB = getThemeSimilarity(b);
    return similarityB - similarityA;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Theme Presets
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Quick-start with professionally designed color schemes
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPresets.map((preset) => {
            const similarity = getThemeSimilarity(preset);
            const isSelected = selectedPreset === preset.id;
            
            return (
              <div
                key={preset.id}
                className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedPreset(preset.id)}
              >
                {/* Similarity Badge */}
                {similarity > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 text-xs"
                  >
                    {Math.round(similarity)}% match
                  </Badge>
                )}
                
                {/* Theme Preview */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: preset.colors.primaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: preset.colors.secondaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: preset.colors.accentColor }}
                    />
                  </div>
                  <preset.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* Theme Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{preset.name}</h4>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {preset.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Apply Button */}
                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyPreset(preset);
                    setSelectedPreset(null);
                  }}
                >
                  Apply Theme
                </Button>
              </div>
            );
          })}
        </div>
        
        {/* Custom Theme Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Custom Theme</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Start with a preset and customize it further, or create your own from scratch. 
            All changes are applied in real-time for instant preview.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
