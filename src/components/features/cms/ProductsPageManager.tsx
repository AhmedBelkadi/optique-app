'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Settings, 
  Palette,
  Save,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { upsertProductsPageHero } from '@/features/home/services/upsertProductsPageHero';
import { upsertProductsPageSettings } from '@/features/home/services/upsertProductsPageSettings';

interface ProductsPageManagerProps {
  hero: any;
  settings: any;
}

export default function ProductsPageManager({ hero, settings }: ProductsPageManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hero state
  const [heroData, setHeroData] = useState({
    title: hero?.title || 'Our Product Catalog',
    subtitle: hero?.subtitle || 'Discover our premium selection of eyewear, frames, and optical accessories. Find the perfect style that matches your personality and vision needs.',
  });

  // Settings state
  const [settingsData, setSettingsData] = useState({
    pageTitle: settings?.pageTitle || 'Products - Optique',
    pageSubtitle: settings?.pageSubtitle || 'Browse our complete collection of eyewear and optical products',
    metaTitle: settings?.metaTitle || 'Products - Optique',
    metaDescription: settings?.metaDescription || 'Browse our premium collection of eyewear, frames, and optical accessories',
    showSearch: settings?.showSearch ?? true,
    showCategoryFilter: settings?.showCategoryFilter ?? true,
    showPriceFilter: settings?.showPriceFilter ?? true,
    showSorting: settings?.showSorting ?? true,
    itemsPerPage: settings?.itemsPerPage || 12,
    maxVisiblePages: settings?.maxVisiblePages || 5,
    heroBackground: settings?.heroBackground || 'gradient-to-br from-primary via-primary/95 to-primary/90',
    textColor: settings?.textColor || 'primary-foreground',
    ctaTitle: settings?.ctaTitle || 'Need Help Choosing?',
    ctaSubtitle: settings?.ctaSubtitle || 'Our optical specialists are here to help you find the perfect frames. Book a consultation today.',
    ctaButtonText: settings?.ctaButtonText || 'Book Consultation',
    ctaButtonLink: settings?.ctaButtonLink || '/appointment',
    ctaSecondaryButtonText: settings?.ctaSecondaryButtonText || 'View All Products',
    ctaSecondaryButtonLink: settings?.ctaSecondaryButtonLink || '/products',
  });

  const handleHeroSave = async () => {
    setIsLoading(true);
    try {
      const result = await upsertProductsPageHero(heroData);
      if (result.success) {
        toast.success('Hero section updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update hero section');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    setIsLoading(true);
    try {
      const result = await upsertProductsPageSettings(settingsData);
      if (result.success) {
        toast.success('Page settings updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update page settings');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setHeroData({
      title: 'Our Product Catalog',
      subtitle: 'Discover our premium selection of eyewear, frames, and optical accessories. Find the perfect style that matches your personality and vision needs.',
    });
    setSettingsData({
      pageTitle: 'Products - Optique',
      pageSubtitle: 'Browse our complete collection of eyewear and optical products',
      metaTitle: 'Products - Optique',
      metaDescription: 'Browse our premium collection of eyewear, frames, and optical accessories',
      showSearch: true,
      showCategoryFilter: true,
      showPriceFilter: true,
      showSorting: true,
      itemsPerPage: 12,
      maxVisiblePages: 5,
      heroBackground: 'gradient-to-br from-primary via-primary/95 to-primary/90',
      textColor: 'primary-foreground',
      ctaTitle: 'Need Help Choosing?',
      ctaSubtitle: 'Our optical specialists are here to help you find the perfect frames. Book a consultation today.',
      ctaButtonText: 'Book Consultation',
      ctaButtonLink: '/appointment',
      ctaSecondaryButtonText: 'View All Products',
      ctaSecondaryButtonLink: '/products',
    });
    toast.success('Reset to default values');
  };

  return (
    <div className="space-y-6">
      {/* Page Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Products Page Overview
          </CardTitle>
          <CardDescription>
            Manage the content and settings for your products listing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Hero Section</h3>
              <p className="text-sm text-muted-foreground">Main title and subtitle</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Display Settings</h3>
              <p className="text-sm text-muted-foreground">Filters, search, pagination</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Palette className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">CTA Section</h3>
              <p className="text-sm text-muted-foreground">Call-to-action content</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            Hero Section
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            Display Settings
          </TabsTrigger>
          <TabsTrigger 
            value="cta" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            CTA Section
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Content</CardTitle>
              <CardDescription>
                Customize the main title and subtitle that appears at the top of your products page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Page Title</Label>
                <Input
                  id="hero-title"
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  placeholder="Enter the main page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Page Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  placeholder="Enter the page subtitle"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleHeroSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Hero Section
                </Button>
                <Button variant="outline" onClick={resetToDefaults}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Configure how your products page functions and appears
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Page Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Page Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input
                      id="page-title"
                      value={settingsData.pageTitle}
                      onChange={(e) => setSettingsData({ ...settingsData, pageTitle: e.target.value })}
                      placeholder="Page title for SEO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page-subtitle">Page Subtitle</Label>
                    <Input
                      id="page-subtitle"
                      value={settingsData.pageSubtitle}
                      onChange={(e) => setSettingsData({ ...settingsData, pageSubtitle: e.target.value })}
                      placeholder="Page subtitle for SEO"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      value={settingsData.metaTitle}
                      onChange={(e) => setSettingsData({ ...settingsData, metaTitle: e.target.value })}
                      placeholder="Meta title for SEO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      value={settingsData.metaDescription}
                      onChange={(e) => setSettingsData({ ...settingsData, metaDescription: e.target.value })}
                      placeholder="Meta description for SEO"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Feature Toggles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Feature Toggles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Search Bar</Label>
                      <p className="text-sm text-muted-foreground">Enable product search functionality</p>
                    </div>
                    <Switch
                      checked={settingsData.showSearch}
                      onCheckedChange={(checked) => setSettingsData({ ...settingsData, showSearch: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Category Filter</Label>
                      <p className="text-sm text-muted-foreground">Enable category filtering</p>
                    </div>
                    <Switch
                      checked={settingsData.showCategoryFilter}
                      onCheckedChange={(checked) => setSettingsData({ ...settingsData, showCategoryFilter: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Price Filter</Label>
                      <p className="text-sm text-muted-foreground">Enable price range filtering</p>
                    </div>
                    <Switch
                      checked={settingsData.showPriceFilter}
                      onCheckedChange={(checked) => setSettingsData({ ...settingsData, showPriceFilter: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Sorting Options</Label>
                      <p className="text-sm text-muted-foreground">Enable product sorting</p>
                    </div>
                    <Switch
                      checked={settingsData.showSorting}
                      onCheckedChange={(checked) => setSettingsData({ ...settingsData, showSorting: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pagination Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pagination Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="items-per-page">Items Per Page</Label>
                    <Input
                      id="items-per-page"
                      type="number"
                      min="6"
                      max="24"
                      value={settingsData.itemsPerPage}
                      onChange={(e) => setSettingsData({ ...settingsData, itemsPerPage: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-visible-pages">Max Visible Pages</Label>
                    <Input
                      id="max-visible-pages"
                      type="number"
                      min="3"
                      max="10"
                      value={settingsData.maxVisiblePages}
                      onChange={(e) => setSettingsData({ ...settingsData, maxVisiblePages: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSettingsSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Display Settings
                </Button>
                <Button variant="outline" onClick={resetToDefaults}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Section Tab */}
        <TabsContent value="cta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action Section</CardTitle>
              <CardDescription>
                Customize the CTA section that appears at the bottom of your products page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CTA Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">CTA Content</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-title">CTA Title</Label>
                    <Input
                      id="cta-title"
                      value={settingsData.ctaTitle}
                      onChange={(e) => setSettingsData({ ...settingsData, ctaTitle: e.target.value })}
                      placeholder="Enter the CTA title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-subtitle">CTA Subtitle</Label>
                    <Textarea
                      id="cta-subtitle"
                      value={settingsData.ctaSubtitle}
                      onChange={(e) => setSettingsData({ ...settingsData, ctaSubtitle: e.target.value })}
                      placeholder="Enter the CTA subtitle"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Primary CTA Button */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Primary CTA Button</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-button-text">Button Text</Label>
                    <Input
                      id="cta-button-text"
                      value={settingsData.ctaButtonText}
                      onChange={(e) => setSettingsData({ ...settingsData, ctaButtonText: e.target.value })}
                      placeholder="e.g., Book Consultation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-button-link">Button Link</Label>
                    <Input
                      id="cta-button-link"
                      value={settingsData.ctaButtonLink}
                      onChange={(e) => setSettingsData({ ...settingsData, ctaButtonLink: e.target.value })}
                      placeholder="e.g., /appointment"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Secondary CTA Button */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Secondary CTA Button</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-secondary-button-text">Button Text</Label>
                    <Input
                      id="cta-secondary-button-text"
                      value={settingsData.ctaSecondaryButtonText}
                      onChange={(e) => setSettingsData({ ...settingsData, ctaSecondaryButtonText: e.target.value })}
                      placeholder="e.g., View All Products"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-secondary-button-link">Button Link</Label>
                    <Input
                      id="cta-secondary-button-link"
                      value={settingsData.ctaSecondaryButtonLink}
                      onChange={(e) => setSettingsData({ ...settingsData, ctaSecondaryButtonLink: e.target.value })}
                      placeholder="e.g., /products"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSettingsSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save CTA Settings
                </Button>
                <Button variant="outline" onClick={resetToDefaults}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
