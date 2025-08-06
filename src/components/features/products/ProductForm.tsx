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
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
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
      toast.error('Security token is still loading. Please wait.');
      return;
    }

    if (csrfError) {
      toast.error('Security token error. Please refresh the page.');
      return;
    }

    if (!csrfToken) {
      toast.error('Security token not available. Please refresh the page.');
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
        toast.success('Product updated successfully!');
      } else {
        // For create mode, use the form action
        formAction(formData);
        toast.success('Product created successfully!');
      }
    });
  };

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        const message = mode === 'create' ? 'Product created successfully!' : 'Product updated successfully!';
        toast.success(message, {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        router.push('/admin/products');
      } else if (state.error) {
        toast.error(state.error || `Failed to ${mode} product`, {
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
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Loading security token...</p>
        </CardContent>
      </Card>
    );
  }

  if (csrfError) {
    return (
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Error loading security token. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  if (!csrfToken) {
    return (
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Security token not available. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">

      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              {mode === 'create' ? (
                <Plus className="w-4 h-4 text-white" />
              ) : (
                <Edit className="w-4 h-4 text-white" />
              )}
            </div>
            <span>{mode === 'create' ? 'Product Information' : 'Edit Product Information'}</span>
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
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Product Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter product name"
                          className={`transition-all duration-200 ${
                            state.fieldErrors?.name 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.name && (
                          <div className="flex items-center text-red-600">
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
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Price *
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
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.price && (
                          <div className="flex items-center text-red-600">
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
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Brand
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter brand name"
                          className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.brand && (
                          <div className="flex items-center text-red-600">
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
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Reference
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter reference"
                          className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {state.fieldErrors?.reference && (
                          <div className="flex items-center text-red-600">
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
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Enter product description"
                        className={`transition-all duration-200 ${
                          state.fieldErrors?.description 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {state.fieldErrors?.description && (
                        <div className="flex items-center text-red-600">
                          <X className="w-4 h-4 mr-1" />
                          {state.fieldErrors.description}
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-sm font-medium text-slate-700 mb-3 block">
                  Categories *
                </FormLabel>
                <CategoryMultiSelect
                  categories={categories}
                  selectedCategoryIds={selectedCategoryIds}
                  onSelectionChange={setSelectedCategoryIds}
                />
                {state.fieldErrors?.categoryIds && (
                  <div className="flex items-center text-red-600 mt-2">
                    <X className="w-4 h-4 mr-1" />
                    {state.fieldErrors.categoryIds}
                  </div>
                )}
              </div>

              <div>
                <FormLabel className="text-sm font-medium text-slate-700 mb-3 block">
                  Product Images
                </FormLabel>
                <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />
              </div>

              {state.error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center text-red-700">
                      <X className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{state.error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      {mode === 'create' ? (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Product
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Update Product
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