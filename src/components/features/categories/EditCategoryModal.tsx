'use client';

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateCategoryAction } from '@/features/categories/actions/updateCategory';
import CategoryImageUpload from '@/components/features/categories/CategoryImageUpload';
import { Category } from '@/features/categories/schema/categorySchema';

interface EditCategoryModalProps {
  category: Category;
  onSuccess?: () => void;
}

export default function EditCategoryModal({ category, onSuccess }: EditCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const previousIsPending = useRef(false);
  
  const [state, formAction, isPending] = useActionState(updateCategoryAction, {
    error: '',
    fieldErrors: {},
    values: {
      name: category.name,
      description: category.description || '',
    },
  });

  const handleSubmit = (formData: FormData) => {
    // Add category ID and image file to form data
    formData.append('categoryId', category.id);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    formAction(formData);
  };

  // Handle successful update
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error) {
      // Success - reset form and hide it
      setOpen(false);
      setImageFile(null);
      toast.success('Category updated successfully!');
      onSuccess?.();
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Failed to update category');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={state.values?.name || category.name}
                placeholder="Enter category name"
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-red-600 mt-1">{state.fieldErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={state.values?.description || category.description || ''}
                placeholder="Enter category description"
              />
              {state.fieldErrors?.description && (
                <p className="text-sm text-red-600 mt-1">{state.fieldErrors.description}</p>
              )}
            </div>

            <CategoryImageUpload
              currentImage={category.image}
              onImageChange={setImageFile}
            />
          </div>

          {state.error && (
            <div className="text-red-600 text-sm">{state.error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Update Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 