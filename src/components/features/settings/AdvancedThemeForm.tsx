'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Palette, Save, RotateCcw, Eye, Settings, Zap, Layers } from 'lucide-react';
import { SettingsWithTimestamps } from '@/features/settings/schema/settingsSchema';
import { upsertSettingsAction } from '@/features/settings/actions/upsertSettings';
import ColorPreview from './ColorPreview';
import ThemePresets from './ThemePresets';

interface AdvancedThemeFormProps {
  settings: SettingsWithTimestamps;
}

export default function AdvancedThemeForm({ settings }: AdvancedThemeFormProps) {
  const [activeTab, setActiveTab] = useState('presets');
  const [previewMode, setPreviewMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      // Basic Colors
      primaryColor: settings.primaryColor || '',
      secondaryColor: settings.secondaryColor || '',
      
      // Advanced theme settings
      accentColor: settings.accentColor || '#10b981',
      backgroundColor: settings.backgroundColor || '#ffffff',
      mutedBackgroundColor: settings.mutedBackgroundColor || '#f8fafc',
      cardBackgroundColor: settings.cardBackgroundColor || '#ffffff',
      foregroundColor: settings.foregroundColor || '#0f172a',
      mutedForegroundColor: settings.mutedForegroundColor || '#64748b',
      borderColor: settings.borderColor || '#e2e8f0',
      popoverBackgroundColor: settings.popoverBackgroundColor || '#ffffff',
      popoverForegroundColor: settings.popoverForegroundColor || '#0f172a',
      successColor: settings.successColor || '#10b981',
      warningColor: settings.warningColor || '#f59e0b',
      errorColor: settings.errorColor || '#ef4444',
      infoColor: settings.infoColor || '#3b82f6',
      
      // Hero Section Specific Colors
      heroBadgeBackground: settings.heroBadgeBackground || '#f59e0b',
      heroBadgeText: settings.heroBadgeText || '#ffffff',
      heroScrollIndicatorColor: settings.heroScrollIndicatorColor || '#ffffff',
      
      // Welcome Section Specific Colors
      welcomeBadgeBackground: settings.welcomeBadgeBackground || '#3b82f6',
      welcomeBadgeText: settings.welcomeBadgeText || '#ffffff',
      welcomeFeatureIcon1Color: settings.welcomeFeatureIcon1Color || '#10b981',
      welcomeFeatureIcon2Color: settings.welcomeFeatureIcon2Color || '#3b82f6',
      welcomeFeatureIcon3Color: settings.welcomeFeatureIcon3Color || '#f59e0b',
      
      // Products Section Specific Colors
      productsNewBadgeColor: settings.productsNewBadgeColor || '#10b981',
      productsPopularBadgeColor: settings.productsPopularBadgeColor || '#f59e0b',
      productsCategoryBadgeBackground: settings.productsCategoryBadgeBackground || '#ffffff',
      productsCategoryBadgeText: settings.productsCategoryBadgeText || '#0f172a',
      
      // Testimonials Section Specific Colors
      testimonialsBadgeBackground: settings.testimonialsBadgeBackground || '#f59e0b',
      testimonialsBadgeText: settings.testimonialsBadgeText || '#ffffff',
      testimonialsStarColor: settings.testimonialsStarColor || '#f59e0b',
      testimonialsVerifiedBadgeColor: settings.testimonialsVerifiedBadgeColor || '#3b82f6',
      
      // Floating CTA Specific Colors
      floatingCTAGlowColor: settings.floatingCTAGlowColor || '#3b82f6',
      floatingCTAParticlesColor: settings.floatingCTAParticlesColor || '#ffffff',
      
      // Gradient Overlays
      heroOverlayStartColor: settings.heroOverlayStartColor || 'rgba(0,0,0,0.6)',
      heroOverlayMiddleColor: settings.heroOverlayMiddleColor || 'rgba(0,0,0,0.4)',
      heroOverlayEndColor: settings.heroOverlayEndColor || 'rgba(0,0,0,0.7)',
      
      // Decorative Elements
      decorativeElement1Color: settings.decorativeElement1Color || 'rgba(59,130,246,0.2)',
      decorativeElement2Color: settings.decorativeElement2Color || 'rgba(139,92,246,0.2)',
      decorativeElement3Color: settings.decorativeElement3Color || 'rgba(16,185,129,0.2)',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add all form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value as string);
        }
      });

      const result = await upsertSettingsAction(formData);
      
      if (result?.success) {
        toast.success('Theme settings saved successfully!');
        // Force a page refresh to apply the new theme
        window.location.reload();
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to save theme settings');
      console.error('Error saving theme:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToDefaults = () => {
    form.reset({
      primaryColor: settings.primaryColor || '',
      secondaryColor: settings.secondaryColor || '',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      mutedBackgroundColor: '#f8fafc',
      cardBackgroundColor: '#ffffff',
      foregroundColor: '#0f172a',
      mutedForegroundColor: '#64748b',
      borderColor: '#e2e8f0',
      popoverBackgroundColor: '#ffffff',
      popoverForegroundColor: '#0f172a',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
      heroBadgeBackground: '#f59e0b',
      heroBadgeText: '#ffffff',
      heroScrollIndicatorColor: '#ffffff',
      welcomeBadgeBackground: '#3b82f6',
      welcomeBadgeText: '#ffffff',
      welcomeFeatureIcon1Color: '#10b981',
      welcomeFeatureIcon2Color: '#3b82f6',
      welcomeFeatureIcon3Color: '#f59e0b',
      productsNewBadgeColor: '#10b981',
      productsPopularBadgeColor: '#f59e0b',
      productsCategoryBadgeBackground: '#ffffff',
      productsCategoryBadgeText: '#0f172a',
      testimonialsBadgeBackground: '#f59e0b',
      testimonialsBadgeText: '#ffffff',
      testimonialsStarColor: '#f59e0b',
      testimonialsVerifiedBadgeColor: '#3b82f6',
      floatingCTAGlowColor: '#3b82f6',
      floatingCTAParticlesColor: '#ffffff',
      heroOverlayStartColor: 'rgba(0,0,0,0.6)',
      heroOverlayMiddleColor: 'rgba(0,0,0,0.4)',
      heroOverlayEndColor: 'rgba(0,0,0,0.7)',
      decorativeElement1Color: 'rgba(59,130,246,0.2)',
      decorativeElement2Color: 'rgba(139,92,246,0.2)',
      decorativeElement3Color: 'rgba(16,185,129,0.2)',
    }, { keepDefaultValues: true });
    toast.success('Reset to default theme settings');
  };

  const handlePresetApply = (preset: any) => {
    // Update form with preset colors
    Object.entries(preset.colors).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });
    
    toast.success(`Applied ${preset.name} theme!`);
  };

  const handleColorChange = (name: string, value: string) => {
    form.setValue(name as any, value);
  };

  const currentTheme = form.watch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Advanced Theme Settings</h3>
          <p className="text-muted-foreground">
            Customize every aspect of your website's visual appearance with live previews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Hide' : 'Show'} Preview
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
            <TabsTrigger 
              value="presets" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Palette className="w-4 h-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger 
              value="basic" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger 
              value="sections" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Layers className="w-4 h-4" />
              Sections
            </TabsTrigger>
          </TabsList>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-6">
            <ThemePresets 
              onApplyPreset={handlePresetApply}
              currentTheme={currentTheme}
            />
          </TabsContent>

          {/* Basic Colors Tab */}
          <TabsContent value="basic" className="space-y-6">
            <ColorPreview
              title="Basic Theme Colors"
              description="Primary colors that define your brand identity"
              colors={[
                {
                  name: 'primaryColor',
                  value: currentTheme.primaryColor || '',
                  label: 'Primary Color',
                  type: 'primary',
                },
                {
                  name: 'secondaryColor',
                  value: currentTheme.secondaryColor || '',
                  label: 'Secondary Color',
                  type: 'secondary',
                },
                {
                  name: 'accentColor',
                  value: currentTheme.accentColor || '',
                  label: 'Accent Color',
                  type: 'accent',
                },
              ]}
              onColorChange={handleColorChange}
            />

            <ColorPreview
              title="Background Colors"
              description="Colors for different background areas"
              colors={[
                {
                  name: 'backgroundColor',
                  value: currentTheme.backgroundColor || '',
                  label: 'Main Background',
                  type: 'background',
                },
                {
                  name: 'cardBackgroundColor',
                  value: currentTheme.cardBackgroundColor || '',
                  label: 'Card Background',
                  type: 'background',
                },
                {
                  name: 'mutedBackgroundColor',
                  value: currentTheme.mutedBackgroundColor || '',
                  label: 'Muted Background',
                  type: 'background',
                },
              ]}
              onColorChange={handleColorChange}
            />

            <ColorPreview
              title="Text Colors"
              description="Colors for different text elements"
              colors={[
                {
                  name: 'foregroundColor',
                  value: currentTheme.foregroundColor || '',
                  label: 'Main Text Color',
                  type: 'text',
                },
                {
                  name: 'mutedForegroundColor',
                  value: currentTheme.mutedForegroundColor || '',
                  label: 'Muted Text Color',
                  type: 'text',
                },
                {
                  name: 'borderColor',
                  value: currentTheme.borderColor || '',
                  label: 'Border Color',
                  type: 'text',
                },
              ]}
              onColorChange={handleColorChange}
            />
          </TabsContent>

          {/* Advanced Colors Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <ColorPreview
              title="Status Colors"
              description="Colors for different states and notifications"
              colors={[
                {
                  name: 'successColor',
                  value: currentTheme.successColor || '',
                  label: 'Success Color',
                  type: 'status',
                },
                {
                  name: 'warningColor',
                  value: currentTheme.warningColor || '',
                  label: 'Warning Color',
                  type: 'status',
                },
                {
                  name: 'errorColor',
                  value: currentTheme.errorColor || '',
                  label: 'Error Color',
                  type: 'status',
                },
                {
                  name: 'infoColor',
                  value: currentTheme.infoColor || '',
                  label: 'Info Color',
                  type: 'status',
                },
              ]}
              onColorChange={handleColorChange}
            />

            <ColorPreview
              title="UI Element Colors"
              description="Colors for popovers and interactive elements"
              colors={[
                {
                  name: 'popoverBackgroundColor',
                  value: currentTheme.popoverBackgroundColor || '',
                  label: 'Popover Background',
                  type: 'background',
                },
                {
                  name: 'popoverForegroundColor',
                  value: currentTheme.popoverForegroundColor || '',
                  label: 'Popover Text',
                  type: 'text',
                },
              ]}
              onColorChange={handleColorChange}
            />
          </TabsContent>

          {/* Section Colors Tab */}
          <TabsContent value="sections" className="space-y-6">
            <ColorPreview
              title="Hero Section Colors"
              description="Colors specific to the hero section"
              colors={[
                {
                  name: 'heroBadgeBackground',
                  value: currentTheme.heroBadgeBackground || '',
                  label: 'Badge Background',
                  type: 'primary',
                },
                {
                  name: 'heroBadgeText',
                  value: currentTheme.heroBadgeText || '',
                  label: 'Badge Text',
                  type: 'text',
                },
                {
                  name: 'heroScrollIndicatorColor',
                  value: currentTheme.heroScrollIndicatorColor || '',
                  label: 'Scroll Indicator',
                  type: 'accent',
                },
              ]}
              onColorChange={handleColorChange}
            />

            <ColorPreview
              title="Welcome Section Colors"
              description="Colors for the welcome section features"
              colors={[
                {
                  name: 'welcomeBadgeBackground',
                  value: currentTheme.welcomeBadgeBackground || '',
                  label: 'Badge Background',
                  type: 'primary',
                },
                {
                  name: 'welcomeFeatureIcon1Color',
                  value: currentTheme.welcomeFeatureIcon1Color || '',
                  label: 'Feature Icon 1',
                  type: 'accent',
                },
                {
                  name: 'welcomeFeatureIcon2Color',
                  value: currentTheme.welcomeFeatureIcon2Color || '',
                  label: 'Feature Icon 2',
                  type: 'accent',
                },
                {
                  name: 'welcomeFeatureIcon3Color',
                  value: currentTheme.welcomeFeatureIcon3Color || '',
                  label: 'Feature Icon 3',
                  type: 'accent',
                },
              ]}
              onColorChange={handleColorChange}
            />

            <ColorPreview
              title="Products Section Colors"
              description="Colors for product badges and elements"
              colors={[
                {
                  name: 'productsNewBadgeColor',
                  value: currentTheme.productsNewBadgeColor || '',
                  label: 'New Badge',
                  type: 'status',
                },
                {
                  name: 'productsPopularBadgeColor',
                  value: currentTheme.productsPopularBadgeColor || '',
                  label: 'Popular Badge',
                  type: 'status',
                },
                {
                  name: 'productsCategoryBadgeBackground',
                  value: currentTheme.productsCategoryBadgeBackground || '',
                  label: 'Category Badge Background',
                  type: 'background',
                },
              ]}
              onColorChange={handleColorChange}
            />

            <ColorPreview
              title="Testimonials Section Colors"
              description="Colors for testimonials and reviews"
              colors={[
                {
                  name: 'testimonialsStarColor',
                  value: currentTheme.testimonialsStarColor || '',
                  label: 'Star Color',
                  type: 'status',
                },
                {
                  name: 'testimonialsVerifiedBadgeColor',
                  value: currentTheme.testimonialsVerifiedBadgeColor || '',
                  label: 'Verified Badge',
                  type: 'status',
                },
              ]}
              onColorChange={handleColorChange}
            />
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Live Preview Toggle */}
      {previewMode && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Live Preview Mode
            </CardTitle>
            <CardDescription>
              All color changes are applied in real-time. Open your website in another tab to see the changes live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: currentTheme.primaryColor || '#3b82f6' }}
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: currentTheme.secondaryColor || '#8b5cf6' }}
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: currentTheme.accentColor || '#10b981' }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                Colors are being applied to your website in real-time
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
