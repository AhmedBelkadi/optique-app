'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, ArrowLeft, Loader2, X, Edit } from 'lucide-react';
import { createProductAction } from '@/features/products/actions/createProduct';
import { updateProductAction } from '@/features/products/actions/updateProduct';
import ImageUpload from '@/components/features/products/ImageUpload';
import CategoryMultiSelect from '@/components/features/categories/CategoryMultiSelect';
import { Category } from '@/features/categories/schema/categorySchema';
import { Product } from '@/features/products/schema/productSchema';
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
import { useCSRF } from '@/components/common/CSRFProvider';

interface ImageFile {
  id: string;
  file?: File; // Only for new images
  preview: string;
  alt: string;
  existing?: boolean;
  serverId?: string;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  categories: Category[];
  product?: Product; // Only for edit mode
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Le nom du produit est requis'),
  description: z.string().optional(),
  price: z.string().min(1, 'Le prix est requis'),
  brand: z.string().optional(),
  reference: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm({ mode, categories, product }: ProductFormProps) {
  const router = useRouter();
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    product?.categories.map(cat => cat.id) || []
  );
  const [images, setImages] = useState<ImageFile[]>(
    product?.images.map(img => ({
      id: img.id,
      preview: img.path,
      alt: img.alt || '',
      existing: true,
      serverId: img.id,
    })) || []
  );
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();

  // Use create action for both modes, handle edit logic in form submission
  const [state, formAction] = useActionState(createProductAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price?.toString() || '',
      brand: product?.brand || '',
      reference: product?.reference || '',
      categoryIds: product?.categories.map(cat => cat.id) || [],
    },
    productId: '',
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: state.values?.name || product?.name || '',
      description: state.values?.description || product?.description || '',
      price: state.values?.price || product?.price?.toString() || '',
      brand: state.values?.brand || product?.brand || '',
      reference: state.values?.reference || product?.reference || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (csrfLoading) {
             toast.error('Le jeton de sécurité est encore en cours de chargement. Veuillez patienter.');
      return;
    }

    if (csrfError) {
             toast.error('Erreur du jeton de sécurité. Veuillez actualiser la page.');
      return;
    }

    if (!csrfToken) {
             toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    const formData = new FormData();
    
    // Add form fields
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price);
    formData.append('brand', data.brand || '');
    formData.append('reference', data.reference || '');
    
    // Add CSRF token
    formData.append('csrf_token', csrfToken);
    
    // Add product ID for edit mode
    if (mode === 'edit' && product) {
      formData.append('id', product.id);
    }
    
    // Add categories
    selectedCategoryIds.forEach((id) => formData.append('categoryIds', id));
    
    // Add images - handle both new and existing images
    if (mode === 'edit') {
      // For edit mode, track which existing images to keep
      const existingImages = images.filter(img => img.existing);
      existingImages.forEach(img => {
        if (img.serverId) {
          formData.append('keepImageIds', img.serverId);
        }
      });
      
      // Add new images
      const newImages = images.filter(img => img.file);
      newImages.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });
    } else {
      // For create mode, just add all images
      images.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });
    }
    
    // Use startTransition to properly handle the async action
    startTransition(() => {
      if (mode === 'edit') {
        // For edit mode, call update action directly
        updateProductAction(state, formData);
                 toast.success('Produit mis à jour avec succès !');
      } else {
        // For create mode, use the form action
        formAction(formData);
                 toast.success('Produit créé avec succès !');
      }
    });
  };

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
                 const message = mode === 'create' ? 'Produit créé avec succès !' : 'Produit mis à jour avec succès !';
        toast.success(message, {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        router.push('/admin/products');
      } else if (state.error) {
                 toast.error(state.error || `Échec de la ${mode === 'create' ? 'création' : 'mise à jour'} du produit`, {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, router, mode]);

  // Update form values when state changes
  useEffect(() => {
    if (state.values) {
      form.reset({
        name: state.values.name || '',
        description: state.values.description || '',
        price: state.values.price || '',
        brand: state.values.brand || '',
        reference: state.values.reference || '',
      });
    }
  }, [state.values, form]);

  if (csrfLoading) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-muted-foreground">Chargement du jeton de sécurité...</p>
        </CardContent>
      </Card>
    );
  }

  if (csrfError) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-muted-foreground">Erreur lors du chargement du jeton de sécurité. Veuillez actualiser la page.</p>
        </CardContent>
      </Card>
    );
  }

  if (!csrfToken) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-muted-foreground">Jeton de sécurité non disponible. Veuillez actualiser la page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">

      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              {mode === 'create' ? (
                <Plus className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Edit className="w-4 h-4 text-primary-foreground" />
              )}
            </div>
            <span>{mode === 'create' ? 'Informations du Produit' : 'Modifier les Informations du Produit'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Nom du Produit *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Entrez le nom du produit"
                          className={`transition-all duration-200 ${
                            state.fieldErrors?.name 
                              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.name && (
                          <div className="flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            {state.fieldErrors.name}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Prix *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className={`transition-all duration-200 ${
                            state.fieldErrors?.price 
                              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.price && (
                          <div className="flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            {state.fieldErrors.price}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Marque
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Entrez le nom de la marque"
                          className="border-border focus:border-primary focus:ring-primary transition-all duration-200"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.brand && (
                          <div className="flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            {state.fieldErrors.brand}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Référence
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Entrez la référence"
                          className="border-border focus:border-primary focus:ring-primary transition-all duration-200"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.reference && (
                          <div className="flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            {state.fieldErrors.reference}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Entrez la description du produit"
                        className={`transition-all duration-200 ${
                          state.fieldErrors?.description 
                            ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                            : 'border-border focus:border-primary focus:ring-primary'
                        }`}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {state.fieldErrors?.description && (
                        <div className="flex items-center text-destructive">
                          <X className="w-4 h-4 mr-1" />
                          {state.fieldErrors.description}
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-sm font-medium text-foreground mb-3 block">
                  Catégories *
                </FormLabel>
                <CategoryMultiSelect
                  categories={categories}
                  selectedCategoryIds={selectedCategoryIds}
                  onSelectionChange={setSelectedCategoryIds}
                />
                {state.fieldErrors?.categoryIds && (
                  <div className="flex items-center text-destructive mt-2">
                    <X className="w-4 h-4 mr-1" />
                    {state.fieldErrors.categoryIds}
                  </div>
                )}
              </div>

              <div>
                <FormLabel className="text-sm font-medium text-foreground mb-3 block">
                  Images du Produit
                </FormLabel>
                <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />
              </div>

              {state.error && (
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center text-destructive">
                      <X className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{state.error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                <Button 
                  type="button" 
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'create' ? 'Création...' : 'Mise à jour...'}
                    </>
                  ) : (
                    <>
                      {mode === 'create' ? (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Créer le Produit
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Mettre à Jour le Produit
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}