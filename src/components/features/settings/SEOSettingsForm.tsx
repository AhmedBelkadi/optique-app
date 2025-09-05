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
  FolderOpen
} from 'lucide-react';
import { upsertSettingsAction } from '@/features/settings/actions';
import { SettingsWithTimestamps } from '@/features/settings/schema/settingsSchema';
import ImageUploadField from './ImageUploadField';
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

const seoFormSchema = z.object({
  // Homepage SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  
  // Product Pages SEO
  productMetaTitle: z.string().optional(),
  productMetaDescription: z.string().optional(),
  
  // Category Pages SEO
  categoryMetaTitle: z.string().optional(),
  categoryMetaDescription: z.string().optional(),
  
  // Analytics
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
});

type SEOFormData = z.infer<typeof seoFormSchema>;

interface SEOSettingsFormProps {
  settings: SettingsWithTimestamps;
}

export default function SEOSettingsForm({ settings }: SEOSettingsFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('homepage');
  const [showPreview, setShowPreview] = useState(false);

  const [state, formAction] = useActionState(upsertSettingsAction, {
    success: false,
    message: '',
    error: '',
  });

  const form = useForm<SEOFormData>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      metaTitle: settings.metaTitle || '',
      metaDescription: settings.metaDescription || '',
      productMetaTitle: settings.productMetaTitle || '',
      productMetaDescription: settings.productMetaDescription || '',
      categoryMetaTitle: settings.categoryMetaTitle || '',
      categoryMetaDescription: settings.categoryMetaDescription || '',
      ogImage: settings.ogImage || '',
      googleAnalyticsId: settings.googleAnalyticsId || '',
      facebookPixelId: settings.facebookPixelId || '',
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
          formData.append(key, value);
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
                value="homepage" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                Homepage
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <FolderOpen className="w-4 h-4" />
                Categories
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
                
                {/* Homepage SEO Tab */}
                <TabsContent value="homepage" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Homepage SEO
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Configure meta tags for your homepage
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title</FormLabel>
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
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Professional eyewear and optical services tailored to your unique needs. Experience the perfect blend of style, comfort, and precision."
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
                                placeholder="Enter image URL or upload file"
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

                {/* Product Pages SEO Tab */}
                <TabsContent value="products" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        Product Pages SEO
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Default meta tags for product pages
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="productMetaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Meta Title Template</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`{product_name} - {brand} | Optique`}
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Use {'{product_name}'} and {'{brand}'} as placeholders
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="productMetaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Meta Description Template</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={`Discover {product_name} by {brand}. Premium eyewear with exceptional quality and style. Shop now at Optique.`}
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Use {'{product_name}'} and {'{brand}'} as placeholders
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Category Pages SEO Tab */}
                <TabsContent value="categories" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-primary" />
                        Category Pages SEO
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Default meta tags for category pages
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="categoryMetaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Meta Title Template</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`{category_name} Eyewear | Optique`}
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Use {'{category_name}'} as placeholder
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryMetaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Meta Description Template</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={`Browse our collection of {category_name} eyewear. Find the perfect frames and lenses for your style and vision needs.`}
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Use {'{category_name}'} as placeholder
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                      <p className="text-sm text-muted-foreground">
                        Configure analytics and marketing pixels
                      </p>
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
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('homepage')}
              >
                <Globe className="h-4 w-4 mr-2" />
                Edit Homepage SEO
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('products')}
              >
                <Tag className="h-4 w-4 mr-2" />
                Edit Product SEO
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('categories')}
              >
                <Search className="h-4 w-4 mr-2" />
                Edit Category SEO
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Manage Analytics
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