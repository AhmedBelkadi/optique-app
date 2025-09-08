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
  Settings,
  Wrench,
  Users,
  HelpCircle,
  Info,
  Lightbulb,
  Target,
  Zap
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
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  canonicalBaseUrl: z.string().optional(),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
  
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
  const [showHelp, setShowHelp] = useState(false);

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
      homepage: settings.homepage ? {
        title: settings.homepage.title || '',
        description: settings.homepage.description || '',
        keywords: settings.homepage.keywords || []
      } : { title: '', description: '', keywords: [] },
      about: settings.about ? {
        title: settings.about.title || '',
        description: settings.about.description || '',
        keywords: settings.about.keywords || []
      } : { title: '', description: '', keywords: [] },
      contact: settings.contact ? {
        title: settings.contact.title || '',
        description: settings.contact.description || '',
        keywords: settings.contact.keywords || []
      } : { title: '', description: '', keywords: [] },
      appointment: settings.appointment ? {
        title: settings.appointment.title || '',
        description: settings.appointment.description || '',
        keywords: settings.appointment.keywords || []
      } : { title: '', description: '', keywords: [] },
      faq: settings.faq ? {
        title: settings.faq.title || '',
        description: settings.faq.description || '',
        keywords: settings.faq.keywords || []
      } : { title: '', description: '', keywords: [] },
      testimonials: settings.testimonials ? {
        title: settings.testimonials.title || '',
        description: settings.testimonials.description || '',
        keywords: settings.testimonials.keywords || []
      } : { title: '', description: '', keywords: [] },
      products: settings.products ? {
        titleTemplate: settings.products.titleTemplate || '',
        descriptionTemplate: settings.products.descriptionTemplate || '',
        keywords: settings.products.keywords || []
      } : { titleTemplate: '', descriptionTemplate: '', keywords: [] },
      productDetails: settings.productDetails ? {
        titleTemplate: settings.productDetails.titleTemplate || '',
        descriptionTemplate: settings.productDetails.descriptionTemplate || '',
        keywords: settings.productDetails.keywords || []
      } : { titleTemplate: '', descriptionTemplate: '', keywords: [] },
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
      toast.error('Token de sécurité non disponible');
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
          <h1 className="text-3xl font-bold text-foreground">Optimisation SEO</h1>
          <p className="text-muted-foreground mt-2">
            Améliorez la visibilité de votre site dans les moteurs de recherche
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            {showHelp ? 'Masquer l\'aide' : 'Aide'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
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
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <p className="font-medium">💡 Qu'est-ce que le SEO ?</p>
              <p className="text-sm">
                Le SEO (Search Engine Optimization) aide votre site à être mieux classé dans Google. 
                Plus votre site est visible, plus vous attirerez de clients !
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Titre de page</p>
                    <p className="text-xs text-blue-700">Ce qui apparaît dans Google</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Description</p>
                    <p className="text-xs text-blue-700">Le texte sous le titre dans Google</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Image sociale</p>
                    <p className="text-xs text-blue-700">Image partagée sur Facebook/WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success/Error Messages */}
      {state.success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-800 font-medium">Paramètres SEO enregistrés avec succès !</span>
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
                Général
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
                Technique
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Statistiques
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
                        Paramètres généraux
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Ces paramètres s'appliquent à toutes les pages de votre site
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Titre de votre site
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Optique - Votre Vision, Notre Expertise" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              💡 Ce titre apparaît dans Google. Recommandé : 50-60 caractères
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
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Description de votre site
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Services optiques professionnels adaptés à vos besoins uniques..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              💡 Cette description apparaît sous le titre dans Google. Recommandé : 150-160 caractères
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
                            <FormLabel className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Image pour les réseaux sociaux
                            </FormLabel>
                            <FormControl>
                              <ImageUploadField
                                label=""
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Téléchargez une image pour le partage sur Facebook/WhatsApp"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              💡 Image qui apparaît quand vous partagez votre site sur Facebook ou WhatsApp. Recommandé : 1200x630 pixels
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
                          Page d'accueil
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Personnalisez l'apparence de votre page d'accueil dans Google
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="homepage.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Titre de la page d'accueil</FormLabel>
                              <FormControl>
                                <Input placeholder="Titre de votre page d'accueil" {...field} />
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
                              <FormLabel>Description de la page d'accueil</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Description de votre page d'accueil" {...field} />
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
                          Page À propos
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Optimisez votre page "À propos" pour Google
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="about.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Titre de la page À propos</FormLabel>
                              <FormControl>
                                <Input placeholder="À propos de [Nom de votre site]" {...field} />
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
                              <FormLabel>Description de la page À propos</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Description de votre page À propos" {...field} />
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
                          Page Contact
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Améliorez la visibilité de votre page contact
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="contact.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Titre de la page Contact</FormLabel>
                              <FormControl>
                                <Input placeholder="Contact [Nom de votre site] - Opticien [Ville]" {...field} />
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
                              <FormLabel>Description de la page Contact</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Description de votre page Contact" {...field} />
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
                          Page Produits
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Optimisez votre page produits pour attirer plus de clients
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="products.titleTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modèle de titre pour les produits</FormLabel>
                              <FormControl>
                                <Input placeholder="[Nom de votre site] - Collection Lunettes Premium" {...field} />
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
                              <FormLabel>Modèle de description pour les produits</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Découvrez notre collection premium..." {...field} />
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
                        Paramètres techniques
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Configuration avancée pour les moteurs de recherche
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="canonicalBaseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL de base de votre site</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://votresite.com" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              💡 L'URL principale de votre site (ex: https://votre-optique.com)
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
                                <FormLabel className="text-base">Autoriser l'indexation</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Permettre à Google d'indexer vos pages
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
                                <FormLabel className="text-base">Autoriser le suivi des liens</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Permettre à Google de suivre les liens de vos pages
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
                        Statistiques et suivi
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Suivez les performances de votre site avec Google Analytics
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
                              ID Google Analytics
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="G-XXXXXXXXXX" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              💡 Votre identifiant Google Analytics pour suivre les visiteurs (ex: G-ABC123DEF4)
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
                              ID Facebook Pixel
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123456789012345" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              💡 Votre identifiant Facebook Pixel pour le suivi des conversions
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
                                placeholder="Code de vérification Search Console" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              💡 Votre code de vérification Google Search Console
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
                  Aperçu SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Titre</Badge>
                    <span className="text-sm font-medium">{watchedValues.metaTitle || 'Non défini'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Description</Badge>
                    <span className="text-sm font-medium">
                      {watchedValues.metaDescription 
                        ? (watchedValues.metaDescription.length > 50 
                            ? watchedValues.metaDescription.substring(0, 50) + '...' 
                            : watchedValues.metaDescription)
                        : 'Non définie'
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Google Analytics</Badge>
                    <span className="text-sm font-medium">{watchedValues.googleAnalyticsId || 'Non configuré'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Facebook Pixel</Badge>
                    <span className="text-sm font-medium">{watchedValues.facebookPixelId || 'Non configuré'}</span>
                  </div>
                </div>

                {/* Character Count */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Compteur de caractères</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Titre: {watchedValues.metaTitle?.length || 0}/60</div>
                    <div>Description: {watchedValues.metaDescription?.length || 0}/160</div>
                  </div>
                </div>

                {/* OG Image Preview */}
                {watchedValues.ogImage && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Image pour réseaux sociaux</p>
                    <div className="w-full h-32 border rounded-lg overflow-hidden">
                      <img 
                        src={watchedValues.ogImage} 
                        alt="Aperçu image sociale" 
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
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('overview')}
              >
                <Globe className="h-4 w-4 mr-2" />
                Paramètres généraux
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('pages')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Pages individuelles
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('technical')}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Paramètres techniques
              </Button>

              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistiques
              </Button>
            </CardContent>
          </Card>

          {/* Save Status */}
          <Card>
            <CardHeader>
              <CardTitle>État d'enregistrement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Enregistrement en cours...</span>
                  </>
                ) : state.success ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-emerald-600">Toutes les modifications sont sauvegardées</span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    <span className="text-sm text-muted-foreground">Aucune modification non sauvegardée</span>
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