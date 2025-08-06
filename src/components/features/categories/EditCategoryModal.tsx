'use client';

import { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Edit, X, Loader2 } from 'lucide-react';
import { updateCategoryAction } from '@/features/categories/actions/updateCategory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useCSRF } from '@/components/common/CSRFProvider';
import CategoryImageUpload from './CategoryImageUpload';

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  categoryDescription?: string | null;
  categoryImage?: string | null;
  onSuccess?: () => void;
}

export default function EditCategoryModal({
  open,
  onClose,
  categoryId,
  categoryName,
  categoryDescription,
  categoryImage,
  onSuccess,
}: EditCategoryModalProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [state, formAction, isPending] = useActionState(updateCategoryAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: categoryName,
      description: categoryDescription || '',
    },
  });

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Category updated successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        onSuccess?.();
        onClose();
        // Reset form
        setSelectedImage(null);
      } else if (state.error) {
        toast.error(state.error || 'Failed to update category', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess, onClose]);

  const handleSubmit = (formData: FormData) => {
    formData.append('categoryId', categoryId);
    // Add CSRF token to form data
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    
    // Add image if a new one is selected
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    
    formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Edit Category
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1">
                Update category information
              </p>
            </div>
          </div>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Image Upload */}
            <CategoryImageUpload
              currentImage={categoryImage}
              onImageChange={setSelectedImage}
            />

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Category Name *
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                required
                defaultValue={state.values?.name || categoryName}
                className={`transition-all duration-200 ${
                  state.fieldErrors?.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="e.g., Sunglasses, Frames, Contact Lenses"
                disabled={isPending}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {state.fieldErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={state.values?.description || categoryDescription || ''}
                className={`transition-all duration-200 ${
                  state.fieldErrors?.description 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Describe this category (optional)"
                disabled={isPending}
              />
              {state.fieldErrors?.description && (
                <p className="text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {state.fieldErrors.description}
                </p>
              )}
            </div>
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

          <DialogFooter className="pt-4">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Category
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
