'use client';

import { useState, useTransition, useEffect } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  Loader2, 
  Search,
  BarChart3,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Globe,
  Image as ImageIcon,
  Tag,
  TrendingUp,
  MessageSquare,
  Home,
  Package,
  FolderOpen,
  Settings,
  Calendar,
  HelpCircle,
  Users,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { upsertSEOSettingsAction } from '@/features/settings/actions/upsertSEOSettings';
import { SEOSettings } from '@/features/settings/schema/settingsSchema';
import ImageUploadField from '@/components/features/settings/ImageUploadField';
import { useCSRF } from '@/components/common/CSRFProvider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const seoFormSchema = z.object({
  // Global SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  
  // Page-specific SEO
  homepage: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  about: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  contact: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  appointment: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  faq: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  testimonials: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  products: z.object({
    titleTemplate: z.string().optional(),
    descriptionTemplate: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  productDetails: z.object({
    titleTemplate: z.string().optional(),
    descriptionTemplate: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  
  // Technical SEO
  canonicalBaseUrl: z.string().url().optional(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  
  // Analytics
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  googleSearchConsole: z.string().optional(),
});

type SEOFormData = z.infer<typeof seoFormSchema>;

interface SEOManagementFormProps {
  settings: SEOSettings;
}

export default function SEOManagementForm({ settings }: SEOManagementFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(false);

  const [state, formAction] = useActionState(upsertSEOSettingsAction, {
    success: false,
    message: '',
    error: '',
  });

  const form = useForm<SEOFormData>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      metaTitle: settings.metaTitle || '',
      metaDescription: settings.metaDescription || '',
      ogImage: settings.ogImage || '',
      homepage: settings.homepage || { title: '', description: '', keywords: [] },
      about: settings.about || { title: '', description: '', keywords: [] },
      contact: settings.contact || { title: '', description: '', keywords: [] },
      appointment: settings.appointment || { title: '', description: '', keywords: [] },
      faq: settings.faq || { title: '', description: '', keywords: [] },
      testimonials: settings.testimonials || { title: '', description: '', keywords: [] },
      products: settings.products || { titleTemplate: '', descriptionTemplate: '', keywords: [] },
      productDetails: settings.productDetails || { titleTemplate: '', descriptionTemplate: '', keywords: [] },
      canonicalBaseUrl: settings.canonicalBaseUrl || '',
      robotsIndex: settings.robotsIndex ?? true,
      robotsFollow: settings.robotsFollow ?? true,
      googleAnalyticsId: settings.googleAnalyticsId || '',
      facebookPixelId: settings.facebookPixelId || '',
      googleSearchConsole: settings.googleSearchConsole || '',
    },
  });

  const handleSubmit = async (data: SEOFormData) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      await formAction(formData);
    });
  };

  // Handle state changes with useEffect
  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    }
  }, [state.success, state.message]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SEO Management</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your site's search engine visibility across all public pages
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          
          <Button 
            type="submit" 
            disabled={isPending || csrfLoading}
            onClick={form.handleSubmit(handleSubmit)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save SEO Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {state.success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-800 font-medium">SEO settings saved successfully!</span>
        </div>
      )}

      {state.error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-destructive font-medium">{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="pages" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                Pages
              </TabsTrigger>
              <TabsTrigger 
                value="technical" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Wrench className="w-4 h-4" />
                Technical
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Global SEO Settings
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Configure default meta tags that apply to all pages
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Meta Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Optique - Your Vision, Our Expertise" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Recommended: 50-60 characters
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Meta Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Professional eyewear and optical services tailored to your unique needs..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Recommended: 150-160 characters
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ogImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Open Graph Image</FormLabel>
                            <FormControl>
                              <ImageUploadField
                                label=""
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Upload image for social media sharing"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Recommended: 1200x630 pixels for social media sharing
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pages Tab */}
                <TabsContent value="pages" className="space-y-6">
                  <div className="grid gap-6">
                    {/* Homepage */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-primary" />
                          Homepage SEO
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="homepage.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Homepage Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="homepage.description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Homepage description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* About Page */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          About Page SEO
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="about.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input placeholder="About Us - [Site Name]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="about.description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="About page description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Contact Page */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          Contact Page SEO
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="contact.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Contact [Site Name] - [City] Optician" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contact.description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Contact page description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Products Page */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Products Page SEO
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="products.titleTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title Template</FormLabel>
                              <FormControl>
                                <Input placeholder="[Site Name] - Premium Eyewear Collection" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="products.descriptionTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description Template</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Discover our premium collection..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Technical SEO Tab */}
                <TabsContent value="technical" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        Technical SEO
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="canonicalBaseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Canonical Base URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://yourdomain.com" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Your website's base URL for canonical links
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="robotsIndex"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Allow Indexing</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Allow search engines to index your pages
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="robotsFollow"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Allow Following Links</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Allow search engines to follow links on your pages
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Analytics & Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="googleAnalyticsId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Google Analytics ID
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="G-XXXXXXXXXX" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Your Google Analytics 4 measurement ID
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="facebookPixelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Facebook Pixel ID
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123456789012345" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Your Facebook Pixel ID for conversion tracking
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="googleSearchConsole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              Google Search Console
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Search Console verification code" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Your Google Search Console verification code
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Live Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  SEO Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Meta Title</Badge>
                    <span className="text-sm font-medium">{watchedValues.metaTitle || 'Not set'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Meta Description</Badge>
                    <span className="text-sm font-medium">
                      {watchedValues.metaDescription 
                        ? (watchedValues.metaDescription.length > 50 
                            ? watchedValues.metaDescription.substring(0, 50) + '...' 
                            : watchedValues.metaDescription)
                        : 'Not set'
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Google Analytics</Badge>
                    <span className="text-sm font-medium">{watchedValues.googleAnalyticsId || 'Not set'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Facebook Pixel</Badge>
                    <span className="text-sm font-medium">{watchedValues.facebookPixelId || 'Not set'}</span>
                  </div>
                </div>

                {/* Character Count */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Character Count</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Title: {watchedValues.metaTitle?.length || 0}/60</div>
                    <div>Description: {watchedValues.metaDescription?.length || 0}/160</div>
                  </div>
                </div>

                {/* OG Image Preview */}
                {watchedValues.ogImage && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Open Graph Image</p>
                    <div className="w-full h-32 border rounded-lg overflow-hidden">
                      <img 
                        src={watchedValues.ogImage} 
                        alt="OG Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('overview')}
              >
                <Globe className="h-4 w-4 mr-2" />
                Global Settings
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('pages')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Page Settings
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('technical')}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Technical SEO
              </Button>

              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Save Status */}
          <Card>
            <CardHeader>
              <CardTitle>Save Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Saving changes...</span>
                  </>
                ) : state.success ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-emerald-600">All changes saved</span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    <span className="text-sm text-muted-foreground">No unsaved changes</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
