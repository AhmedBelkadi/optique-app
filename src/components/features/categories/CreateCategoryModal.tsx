'use client';

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCategoryAction } from '@/features/categories/actions/createCategory';
import CategoryImageUpload from '@/components/features/categories/CategoryImageUpload';

interface CreateCategoryModalProps {
  onSuccess?: () => void;
}

export default function CreateCategoryModal({ onSuccess }: CreateCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const previousIsPending = useRef(false);
  
  const [state, formAction, isPending] = useActionState(createCategoryAction, {
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = (formData: FormData) => {
    // Add image file to form data if exists
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    formAction(formData);
  };

  // Handle successful creation
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error) {
      // Success - reset form and hide it
      setOpen(false);
      setImageFile(null);
      toast.success('Category created successfully!');
      onSuccess?.();
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Failed to create category');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={state.values?.name || ''}
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
                defaultValue={state.values?.description || ''}
                placeholder="Enter category description"
              />
              {state.fieldErrors?.description && (
                <p className="text-sm text-red-600 mt-1">{state.fieldErrors.description}</p>
              )}
            </div>

            <CategoryImageUpload
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
              {isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 