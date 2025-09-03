'use client';

import { useState, useEffect, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import ColorPicker from '@/components/features/settings/ColorPicker';
import ImageUpload from '@/components/features/settings/ImageUpload';
import { useCSRF } from '@/components/common/CSRFProvider';
import { 
  siteSettingsSchema, 
  contactSettingsSchema, 
  themeSettingsSchema, 
  type SiteSettings,
  type ContactSettings,
  type ThemeSettings,
  type OperationalSettings
} from '@/features/settings/schema/settingsSchema';
import { upsertSiteSettingsAction } from '@/features/settings/actions/upsertSiteSettings';
import { upsertContactSettingsAction } from '@/features/settings/actions/upsertContactSettings';
import { upsertThemeSettingsAction } from '@/features/settings/actions/upsertThemeSettings';

// Custom hook to get current theme settings from CSS variables
function useCurrentThemeSettings() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);

  useEffect(() => {
    const getCSSVariable = (name: string) => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || null;
    };

    // Function to check if CSS variables are properly set
    const checkCSSVariables = () => {
      const primary = getCSSVariable('--primary');
      const secondary = getCSSVariable('--secondary');
      
      // Debug logging
      console.log('SettingsForm: CSS variables detected:', {
        primary,
        secondary,
        primaryExists: !!primary,
        secondaryExists: !!secondary
      });
      
      // Check if we have valid CSS variable values
      if (primary && secondary) {
        const currentTheme: ThemeSettings = {
          primaryColor: primary,
          secondaryColor: secondary,
        };

        console.log('SettingsForm: Setting theme from CSS variables:', currentTheme);
        setThemeSettings(currentTheme);
        return true; // CSS variables are ready
      }
      return false; // CSS variables are not ready yet
    };

    // Try to get CSS variables immediately
    if (!checkCSSVariables()) {
      // If not ready, wait a bit and try again
      const timer = setTimeout(() => {
        checkCSSVariables();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []); // Remove hasRun dependency to allow re-running

  return themeSettings;
}




interface SettingsFormProps {
  siteSettings: SiteSettings;
  contactSettings: ContactSettings;
  operationalSettings: OperationalSettings;
  themeSettings?: ThemeSettings;
}

export default function SettingsForm({
  siteSettings,
  contactSettings,
  operationalSettings,
  themeSettings
}: SettingsFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError, retry } = useCSRF();
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  // Action states for better UX
  const [siteState, siteFormAction, isSitePending] = useActionState(
    upsertSiteSettingsAction,
    { success: false, message: '', error: '' }
  );

  const [contactState, contactFormAction, isContactPending] = useActionState(
    upsertContactSettingsAction,
    { success: false, message: '', error: '' }
  );

  const [themeState, themeFormAction, isThemePending] = useActionState(
    upsertThemeSettingsAction,
    { success: false, message: '', error: '' }
  );

  // Get current theme and SEO settings from CSS variables
  const currentThemeSettings = useCurrentThemeSettings();

  // Fallback theme settings if both current and props are null
  const fallbackThemeSettings: ThemeSettings = {
    primaryColor: '222.2 47.4% 11.2%', // Dark blue
    secondaryColor: '210 40% 96%', // Light gray
  };

  // Use current settings if available, otherwise fall back to props, otherwise use fallbacks
  const finalThemeSettings = currentThemeSettings || themeSettings || fallbackThemeSettings;

  // Site Settings Form
  const siteForm = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: siteSettings.siteName || '',
      slogan: siteSettings.slogan || '',
      logoUrl: siteSettings.logoUrl || '',
      heroBackgroundImg: siteSettings.heroBackgroundImg || '',
    },
  });

  // Store selected logo file for upload
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [selectedHeroBackgroundFile, setSelectedHeroBackgroundFile] = useState<File | null>(null);

  // Contact Settings Form
  const contactForm = useForm<ContactSettings>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      contactEmail: contactSettings.contactEmail || '',
      phone: contactSettings.phone || '',
      whatsapp: contactSettings.whatsapp || '',
      address: contactSettings.address || '',
      city: contactSettings.city || '',
      openingHours: contactSettings.openingHours || '',
      googleMapsApiKey: contactSettings.googleMapsApiKey || '',
      whatsappChatLink: contactSettings.whatsappChatLink || '',
      googleMapEmbed: contactSettings.googleMapEmbed || '',
      googleMapLink: contactSettings.googleMapLink || '',
      instagramLink: contactSettings.instagramLink || '',
      facebookLink: contactSettings.facebookLink || '',
    },
  });

  // Clear server errors when user starts typing
  const clearServerError = (fieldName: string) => {
    if (serverErrors[fieldName]) {
      setServerErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };



  // Theme Settings Form
  const themeForm = useForm<ThemeSettings>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      primaryColor: finalThemeSettings?.primaryColor || '222.2 47.4% 11.2%',
      secondaryColor: finalThemeSettings?.secondaryColor || '210 40% 96%',
    },
  });


  // Update form values when currentThemeSettings change
  useEffect(() => {
    if (currentThemeSettings && themeForm) {
      // Update the theme form with current CSS variable values
      Object.entries(currentThemeSettings).forEach(([key, value]) => {
        if (value && themeForm.getFieldState(key as keyof ThemeSettings)) {
          themeForm.setValue(key as keyof ThemeSettings, value);
        }
      });
    }
  }, [currentThemeSettings, themeForm]); // Include themeForm in dependencies

  // Handle action state changes for site settings
  useEffect(() => {
    if (siteState.success) {
      toast.success(siteState.message || '✅ Paramètres du site mis à jour avec succès !', {
        duration: 4000,
        style: {
          background: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #bbf7d0'
        }
      });
      // Clear the selected file after successful save
      setSelectedLogoFile(null);
      setSelectedHeroBackgroundFile(null);
    } else if (siteState.error) {
      toast.error(`❌ ${siteState.error}`, {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
    }
  }, [siteState]);

  // Handle action state changes for contact settings
  useEffect(() => {
    if (contactState.success) {
      toast.success(contactState.message || '✅ Paramètres de contact mis à jour avec succès !', {
        duration: 4000,
        style: {
          background: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #bbf7d0'
        }
      });
      // Clear server errors on success
      setServerErrors({});
    } else if (contactState.error) {
      toast.error(`❌ ${contactState.error}`, {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
    }
  }, [contactState]);

  // Handle action state changes for theme settings
  useEffect(() => {
    if (themeState.success) {
      toast.success(themeState.message || '✅ Paramètres de thème mis à jour avec succès !', {
        duration: 4000,
        style: {
          background: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #bbf7d0'
        }
      });
    } else if (themeState.error) {
      toast.error(`❌ ${themeState.error}`, {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
    }
  }, [themeState]);

  // Handle site settings submission with useActionState
  const onSiteSubmit = async (data: SiteSettings) => {
    if (csrfLoading) {
      toast.error('❌ Veuillez patienter, le jeton de sécurité est en cours de chargement...', {
        duration: 4000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    if (csrfError || !csrfToken) {
      toast.error('❌ Erreur de Sécurité - Jeton CSRF non disponible. Veuillez actualiser la page.', {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    // Client-side validation
    const errors: string[] = [];
    
    if (!data.siteName?.trim()) {
      errors.push('Site name is required');
    }
    
    if (data.siteName && data.siteName.length < 2) {
      errors.push('Site name must be at least 2 characters long');
    }
    
    if (data.slogan && data.slogan.length > 100) {
      errors.push('Slogan must be less than 100 characters');
    }

    if (errors.length > 0) {
      toast.error(`❌ Erreurs de Validation - ${errors.join(', ')}`, {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    try {
      let finalLogoUrl = data.logoUrl;

      // If there's a new logo file selected, upload it first
      if (selectedLogoFile) {
        try {
          toast.loading('📤 Téléchargement du logo...', {
            duration: 0,
            style: {
              background: '#f0f9ff',
              color: '#0369a1',
              border: '1px solid #bae6fd'
            }
          });

          const uploadFormData = new FormData();
          uploadFormData.append('file', selectedLogoFile);
          uploadFormData.append('folder', 'site-settings');

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(errorData.error || 'Échec du téléchargement du logo');
          }

          const uploadResult = await uploadResponse.json();
          finalLogoUrl = uploadResult.url;
          
          toast.dismiss();
          toast.success('✅ Logo téléchargé avec succès !', {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              color: '#16a34a',
              border: '1px solid #bbf7d0'
            }
          });
        } catch (uploadError) {
          toast.dismiss();
          console.error('Logo upload error:', uploadError);
          toast.error(`❌ Échec du téléchargement du logo : ${uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'}`, {
            duration: 6000,
            style: {
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca'
            }
          });
          return;
        }
      }

      // Handle hero background image upload
      let finalHeroBackgroundUrl = data.heroBackgroundImg;
      if (selectedHeroBackgroundFile) {
        try {
          toast.loading('📤 Téléchargement de l\'image de fond du hero...', {
            duration: 0,
            style: {
              background: '#f0f9ff',
              color: '#0369a1',
              border: '1px solid #bae6fd'
            }
          });

          const uploadFormData = new FormData();
          uploadFormData.append('file', selectedHeroBackgroundFile);
          uploadFormData.append('folder', 'hero');

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(errorData.error || 'Échec du téléchargement de l\'image de fond');
          }

          const uploadResult = await uploadResponse.json();
          finalHeroBackgroundUrl = uploadResult.url;
          
          toast.dismiss();
          toast.success('✅ Image de fond du hero téléchargée avec succès !', {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              color: '#16a34a',
              border: '1px solid #bbf7d0'
            }
          });
        } catch (uploadError) {
          toast.dismiss();
          console.error('Hero background upload error:', uploadError);
          toast.error(`❌ Échec du téléchargement de l'image de fond : ${uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'}`, {
            duration: 6000,
            style: {
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca'
            }
          });
          return;
        }
      }

      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      
      // Add form data with final logo URL
      if (data.siteName !== undefined && data.siteName !== null) {
        formData.append('siteName', data.siteName);
      }
      if (data.slogan !== undefined && data.slogan !== null) {
        formData.append('slogan', data.slogan);
      }
      if (finalLogoUrl !== undefined && finalLogoUrl !== null) {
        formData.append('logoUrl', finalLogoUrl);
      }
      if (finalHeroBackgroundUrl !== undefined && finalHeroBackgroundUrl !== null) {
        formData.append('heroBackgroundImg', finalHeroBackgroundUrl);
      }

      // Use the action state action instead of direct call
      startTransition(() => {
        siteFormAction(formData);
      });
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error('❌ Une erreur inattendue s\'est produite - Veuillez réessayer ou contacter le support si le problème persiste', {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
    }
  };

  // Handle contact settings submission with useActionState
  const onContactSubmit = async (data: ContactSettings) => {
    if (csrfLoading) {
      toast.error('❌ Veuillez patienter, le jeton de sécurité est en cours de chargement...', {
        duration: 4000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    if (csrfError || !csrfToken) {
      toast.error('❌ Erreur de Sécurité - Jeton CSRF non disponible. Veuillez actualiser la page.', {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    // Client-side validation
    const errors: string[] = [];
    
    if (!data.contactEmail?.trim()) {
      errors.push('Contact email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!data.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (data.phone.length < 10) {
      errors.push('Phone number must be at least 10 characters');
    }
    
    if (data.address && data.address.length > 200) {
      errors.push('Address must be less than 200 characters');
    }
    
    if (data.openingHours && data.openingHours.length > 100) {
      errors.push('Opening hours must be less than 100 characters');
    }

    if (errors.length > 0) {
      toast.error(`❌ Validation Errors - ${errors.join(', ')}`, {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      // Use the action state action instead of direct call
      startTransition(() => {
        contactFormAction(formData);
      });
    } catch (error) {
      console.error('Error updating contact settings:', error);
      toast.error('❌ Une erreur inattendue s\'est produite - Veuillez réessayer ou contacter le support si le problème persiste', {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
    }
  };

  // Handle theme settings submission with useActionState
  const onThemeSubmit = async (data: ThemeSettings) => {
    if (csrfLoading) {
      toast.error('❌ Veuillez patienter, le jeton de sécurité est en cours de chargement...', {
        duration: 4000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    if (csrfError || !csrfToken) {
      toast.error('❌ Erreur de Sécurité - Jeton CSRF non disponible. Veuillez actualiser la page.', {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      // Use the action state action with startTransition
      startTransition(() => {
        themeFormAction(formData);
      });
    } catch (error) {
      console.error('Error updating theme settings:', error);
      toast.error('❌ Une erreur inattendue s\'est produite - Veuillez réessayer ou contacter le support si le problème persiste', {
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
    }
  };



  // Update theme immediately after form changes
  const updateThemeImmediately = (newData: ThemeSettings) => {
    const root = document.documentElement;
    
    // Core Colors
    if (newData.primaryColor) root.style.setProperty('--primary', newData.primaryColor);
    if (newData.secondaryColor) root.style.setProperty('--secondary', newData.secondaryColor);
  };

  // Watch theme form for live preview
  const watchedThemeValues = themeForm.watch();
  useEffect(() => {
    updateThemeImmediately(watchedThemeValues);
  }, [watchedThemeValues]);


  
  if (csrfLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading CSRF token...</p>
        </div>
      </div>
    );
  }

  if (csrfError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-destructive mb-4">
            <p className="text-lg font-semibold">Failed to load security token</p>
            <p className="text-sm text-muted-foreground mt-2">{csrfError}</p>
        </div>
          <Button onClick={retry} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live Preview</Badge>
          <span className="text-sm text-muted-foreground">
            Theme changes are applied in real-time. Save your changes to persist them.
          </span>
        </div>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border">
          <TabsTrigger 
            value="site" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            Site
          </TabsTrigger>
          <TabsTrigger 
            value="contact" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            Contact
          </TabsTrigger>
          <TabsTrigger 
            value="theme" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            Theme
          </TabsTrigger>
         
        </TabsList>

        {/* Site Settings Tab */}
        <TabsContent value="site" className="space-y-6">
                  <Card>
                    <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
                    </CardHeader>
            <CardContent>
              <form onSubmit={siteForm.handleSubmit(onSiteSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name *</Label>
                  <Input
                    id="siteName"
                    {...siteForm.register('siteName')}
                    placeholder="Enter your site name"
                    className={`transition-all duration-200 ${
                      siteForm.formState.errors.siteName 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                        : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    {siteForm.formState.errors.siteName && (
                      <p className="text-sm text-destructive flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {siteForm.formState.errors.siteName.message}
                      </p>
                    )}
                    <span className={`text-xs ${
                      (siteForm.watch('siteName') || '').length > 45 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {(siteForm.watch('siteName') || '').length}/50
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan</Label>
                  <Input
                    id="slogan"
                    {...siteForm.register('slogan')}
                    placeholder="Enter your site slogan"
                    className={`transition-all duration-200 ${
                      siteForm.formState.errors.slogan 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                        : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    {siteForm.formState.errors.slogan && (
                      <p className="text-sm text-destructive flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {siteForm.formState.errors.slogan.message}
                      </p>
                    )}
                    <span className={`text-xs ${
                      (siteForm.watch('slogan') || '').length > 80 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {(siteForm.watch('slogan') || '').length}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <ImageUpload
                      label="Logo"
                      value={siteForm.watch('logoUrl')}
                      onChange={(value) => siteForm.setValue('logoUrl', value)}
                      onFileChange={setSelectedLogoFile}
                      maxSize={2}
                      folder="site-settings"
                    />
                    {siteForm.formState.errors.logoUrl && (
                      <p className="text-sm text-destructive">
                        {siteForm.formState.errors.logoUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <ImageUpload
                      label="Hero Background Image"
                      value={siteForm.watch('heroBackgroundImg')}
                      onChange={(value) => siteForm.setValue('heroBackgroundImg', value)}
                      onFileChange={setSelectedHeroBackgroundFile}
                      maxSize={5}
                      folder="hero"
                    />
                    {siteForm.formState.errors.heroBackgroundImg && (
                      <p className="text-sm text-destructive">
                        {siteForm.formState.errors.heroBackgroundImg.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={isSitePending || csrfLoading}>
                  {isSitePending ? 'Saving...' : 'Save Site Settings'}
                </Button>
              </form>
                    </CardContent>
                  </Card>
                </TabsContent>

        {/* Contact Settings Tab */}
        <TabsContent value="contact" className="space-y-6">
                  <Card>
                    <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Contact details and location information
              </CardDescription>
                    </CardHeader>
            <CardContent>
              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      {...contactForm.register('contactEmail')}
                      type="email"
                      placeholder="contact@example.com"
                      className={`transition-all duration-200 ${
                        contactForm.formState.errors.contactEmail || serverErrors.contactEmail
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                      }`}
                      onFocus={() => clearServerError('contactEmail')}
                    />
                    <div className="flex items-center justify-between">
                      {(contactForm.formState.errors.contactEmail || serverErrors.contactEmail) && (
                        <p className="text-sm text-destructive flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {contactForm.formState.errors.contactEmail?.message || serverErrors.contactEmail || 'Invalid email format'}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {(contactForm.watch('contactEmail') || '').length}/100
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...contactForm.register('phone')}
                      placeholder="+1 (555) 123-4567"
                      className={`transition-all duration-200 ${
                        contactForm.formState.errors.phone || serverErrors.phone
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                      }`}
                      onFocus={() => clearServerError('phone')}
                    />
                    <div className="flex items-center justify-between">
                      {(contactForm.formState.errors.phone || serverErrors.phone) && (
                        <p className="text-sm text-destructive flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {contactForm.formState.errors.phone?.message || serverErrors.phone || 'Invalid phone number'}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {(contactForm.watch('phone') || '').length}/20
                      </span>
                        </div>
                      </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      {...contactForm.register('whatsapp')}
                      placeholder="+1 (555) 123-4567"
                      className={`transition-all duration-200 ${
                        contactForm.formState.errors.whatsapp || serverErrors.whatsapp
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                      }`}
                      onFocus={() => clearServerError('whatsapp')}
                    />
                    <div className="flex items-center justify-between">
                      {(contactForm.formState.errors.whatsapp || serverErrors.whatsapp) && (
                        <p className="text-sm text-destructive flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {contactForm.formState.errors.whatsapp?.message || serverErrors.whatsapp || 'Invalid WhatsApp number'}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {(contactForm.watch('whatsapp') || '').length}/20
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openingHours">Opening Hours</Label>
                    <Input
                      id="openingHours"
                      {...contactForm.register('openingHours')}
                      placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                      className={`transition-all duration-200 ${
                        contactForm.formState.errors.openingHours || serverErrors.openingHours
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                      }`}
                      onFocus={() => clearServerError('openingHours')}
                    />
                    <div className="flex items-center justify-between">
                      {(contactForm.formState.errors.openingHours || serverErrors.openingHours) && (
                        <p className="text-sm text-destructive flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {contactForm.formState.errors.openingHours?.message || serverErrors.openingHours || 'Invalid opening hours'}
                        </p>
                      )}
                      <span className={`text-xs ${
                        (contactForm.watch('openingHours') || '').length > 80 ? 'text-warning' : 'text-muted-foreground'
                      }`}>
                        {(contactForm.watch('openingHours') || '').length}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    {...contactForm.register('address')}
                    placeholder="Enter your business address"
                    rows={3}
                    className={`transition-all duration-200 ${
                                              contactForm.formState.errors.address || serverErrors.address
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                    onFocus={() => clearServerError('address')}
                  />
                  <div className="flex items-center justify-between">
                    {(contactForm.formState.errors.address || serverErrors.address) && (
                      <p className="text-sm text-destructive flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {contactForm.formState.errors.address?.message || serverErrors.address || 'Invalid address'}
                      </p>
                    )}
                    <span className={`text-xs ${
                      (contactForm.watch('address') || '').length > 180 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {(contactForm.watch('address') || '').length}/200
                    </span>
                        </div>
                      </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...contactForm.register('city')}
                    placeholder="Enter your city"
                    className={`transition-all duration-200 ${
                      contactForm.formState.errors.city || serverErrors.city
                        ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                        : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                    onFocus={() => clearServerError('city')}
                  />
                  <div className="flex items-center justify-between">
                    {(contactForm.formState.errors.city || serverErrors.city) && (
                      <p className="text-sm text-destructive flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {contactForm.formState.errors.city?.message || serverErrors.city || 'Invalid city'}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {(contactForm.watch('city') || '').length}/50
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
                    <Input
                      id="googleMapsApiKey"
                      {...contactForm.register('googleMapsApiKey')}
                      placeholder="Enter your Google Maps API key"
                      className={`transition-all duration-200 ${
                        contactForm.formState.errors.googleMapsApiKey || serverErrors.googleMapsApiKey
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                      }`}
                      onFocus={() => clearServerError('googleMapsApiKey')}
                    />
                    <div className="flex items-center justify-between">
                      {(contactForm.formState.errors.googleMapsApiKey || serverErrors.googleMapsApiKey) && (
                        <p className="text-sm text-destructive flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {contactForm.formState.errors.googleMapsApiKey?.message || serverErrors.googleMapsApiKey || 'Invalid API key'}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {(contactForm.watch('googleMapsApiKey') || '').length}/100
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappChatLink">WhatsApp Chat Link</Label>
                    <Input
                      id="whatsappChatLink"
                      {...contactForm.register('whatsappChatLink')}
                      placeholder="https://wa.me/1234567890"
                      className={`transition-all duration-200 ${
                        contactForm.formState.errors.whatsappChatLink || serverErrors.whatsappChatLink
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                      }`}
                      onFocus={() => clearServerError('whatsappChatLink')}
                    />
                    <div className="flex items-center justify-between">
                      {(contactForm.formState.errors.whatsappChatLink || serverErrors.whatsappChatLink) && (
                        <p className="text-sm text-destructive flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {contactForm.formState.errors.whatsappChatLink?.message || serverErrors.whatsappChatLink || 'Invalid WhatsApp chat link'}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {(contactForm.watch('whatsappChatLink') || '').length}/200
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleMapEmbed">Google Map Embed Code</Label>
                  <Textarea
                    id="googleMapEmbed"
                    {...contactForm.register('googleMapEmbed')}
                    placeholder="Paste your Google Maps embed code here"
                    rows={4}
                    className={`transition-all duration-200 ${
                                              contactForm.formState.errors.googleMapEmbed || serverErrors.googleMapEmbed
                          ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                          : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                    onFocus={() => clearServerError('googleMapEmbed')}
                  />
                  <div className="flex items-center justify-between">
                    {(contactForm.formState.errors.googleMapEmbed || serverErrors.googleMapEmbed) && (
                      <p className="text-sm text-destructive flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {contactForm.formState.errors.googleMapEmbed?.message || serverErrors.googleMapEmbed || 'Invalid embed code'}
                      </p>
                      )}
                    <span className={`text-xs ${
                      (contactForm.watch('googleMapEmbed') || '').length > 800 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {(contactForm.watch('googleMapEmbed') || '').length}/1000
                    </span>
                        </div>
                      </div>

                <div className="space-y-2">
                  <Label htmlFor="googleMapLink">Google Maps Link</Label>
                  <Input
                    id="googleMapLink"
                    {...contactForm.register('googleMapLink')}
                    type="url"
                    placeholder="https://maps.google.com/..."
                    className={`transition-all duration-200 ${
                      contactForm.formState.errors.googleMapLink || serverErrors.googleMapLink
                        ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                        : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                    onFocus={() => clearServerError('googleMapLink')}
                  />
                  <div className="flex items-center justify-between">
                    {(contactForm.formState.errors.googleMapLink || serverErrors.googleMapLink) && (
                      <p className="text-sm text-destructive flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {contactForm.formState.errors.googleMapLink?.message || serverErrors.googleMapLink || 'Invalid Google Maps link'}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {(contactForm.watch('googleMapLink') || '').length}/200
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Media Links</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your social media profiles to connect with customers
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagramLink">Instagram Link</Label>
                      <Input
                        id="instagramLink"
                        {...contactForm.register('instagramLink')}
                        type="url"
                        placeholder="https://instagram.com/yourusername"
                        className={`transition-all duration-200 ${
                          contactForm.formState.errors.instagramLink || serverErrors.instagramLink
                            ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                            : 'border-border focus:border-primary focus:ring-primary'
                        }`}
                        onFocus={() => clearServerError('instagramLink')}
                      />
                      <div className="flex items-center justify-between">
                        {(contactForm.formState.errors.instagramLink || serverErrors.instagramLink) && (
                          <p className="text-sm text-destructive flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {contactForm.formState.errors.instagramLink?.message || serverErrors.instagramLink || 'Invalid Instagram link'}
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {(contactForm.watch('instagramLink') || '').length}/200
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebookLink">Facebook Link</Label>
                      <Input
                        id="facebookLink"
                        {...contactForm.register('facebookLink')}
                        type="url"
                        placeholder="https://facebook.com/yourpage"
                        className={`transition-all duration-200 ${
                          contactForm.formState.errors.facebookLink || serverErrors.facebookLink
                            ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                            : 'border-border focus:border-primary focus:ring-primary'
                        }`}
                        onFocus={() => clearServerError('facebookLink')}
                      />
                      <div className="flex items-center justify-between">
                        {(contactForm.formState.errors.facebookLink || serverErrors.facebookLink) && (
                          <p className="text-sm text-destructive flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {contactForm.formState.errors.facebookLink?.message || serverErrors.facebookLink || 'Invalid Facebook link'}
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {(contactForm.watch('facebookLink') || '').length}/200
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isContactPending || csrfLoading}>
                  {isContactPending ? 'Saving...' : 'Save Contact Settings'}
                </Button>
              </form>
                    </CardContent>
                  </Card>
                </TabsContent>


        {/* Theme Settings Tab */}
        <TabsContent value="theme" className="space-y-6">
                  <Card>
                    <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
              <CardDescription>
                Customize the visual appearance of your website
              </CardDescription>
                    </CardHeader>
            <CardContent>
              <form onSubmit={themeForm.handleSubmit(onThemeSubmit)} className="space-y-6">
                {/* Color Presets */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Color Presets</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from popular color combinations or customize your own
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'Default', primary: '222.2 47.4% 11.2%', secondary: '210 40% 96%' },
                      { name: 'Ocean', primary: '221.2 83.2% 53.3%', secondary: '210 40% 98%' },
                      { name: 'Forest', primary: '142.1 76.2% 36.3%', secondary: '210 40% 98%' },
                      { name: 'Sunset', primary: '38 92% 50%', secondary: '210 40% 98%' },
                      { name: 'Royal', primary: '262.1 83.3% 57.8%', secondary: '210 40% 98%' },
                      { name: 'Crimson', primary: '0 84.2% 60.2%', secondary: '210 40% 98%' },
                      { name: 'Slate', primary: '215.4 16.3% 46.9%', secondary: '210 40% 98%' },
                      { name: 'Emerald', primary: '142.1 70.6% 45.3%', secondary: '210 40% 98%' }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          themeForm.setValue('primaryColor', preset.primary);
                          themeForm.setValue('secondaryColor', preset.secondary);
                        }}
                        className="p-3 border rounded-lg hover:border-primary transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: `hsl(${preset.primary})` }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: `hsl(${preset.secondary})` }}
                          />
                        </div>
                        <div className="text-sm font-medium">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Custom Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Custom Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <ColorPicker
                        label="Primary Color"
                        value={themeForm.watch('primaryColor')}
                        onChange={(value) => themeForm.setValue('primaryColor', value)}
                        placeholder="222.2 47.4% 11.2%"
                      />
                    </div>

                    <div className="space-y-2">
                      <ColorPicker
                        label="Secondary Color"
                        value={themeForm.watch('secondaryColor')}
                        onChange={(value) => themeForm.setValue('secondaryColor', value)}
                        placeholder="210 40% 96%"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isThemePending || csrfLoading}>
                  {isThemePending ? 'Saving...' : 'Save Theme Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
} 
