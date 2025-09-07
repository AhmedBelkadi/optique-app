// --- CreateCategoryModal.tsx ---

'use client';

import { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Loader2 } from 'lucide-react';
import { createCategoryAction } from '@/features/categories/actions/createCategory';
import { CreateCategoryState } from '@/types/api';
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
import { useCSRF } from '@/components/common/CSRFProvider';
import CategoryImageUpload from './CategoryImageUpload';

interface CreateCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (category: any) => void;
}

export default function CreateCategoryModal({ open, onClose, onSuccess }: CreateCategoryModalProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(createCategoryAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      // Reset form when opening
      setSelectedImage(null);
    }
  }, [open]);

  // Update hidden file input when selectedImage changes
  useEffect(() => {
    if (fileInputRef.current) {
      if (selectedImage) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(selectedImage);
        fileInputRef.current.files = dataTransfer.files;
      } else {
        // Clear the file input when no image is selected
        fileInputRef.current.value = '';
      }
    }
  }, [selectedImage]);

  // Handle action completion
  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        // Show success toast
        toast.success('Category created successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });

        // Call success callback with the created category
        if (state.data) {
          onSuccess(state.data);
        }

        // Close modal
        onClose();
      } else if (state.error) {
        // Show error toast
        toast.error(state.error || 'Failed to create category', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, state.data, onSuccess, onClose]);

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Create New Category
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Add a new category to organize your products
              </p>
            </div>
          </div>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {/* Hidden CSRF token */}
          <input type="hidden" name="csrf_token" value={csrfToken || ''} />
          
          {/* Hidden file input for image */}
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter category name"
                disabled={isPending}
                required
                className={state.fieldErrors?.name ? 'border-destructive' : ''}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-destructive mt-1">{state.fieldErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter category description (optional)"
                disabled={isPending}
                rows={3}
                className={state.fieldErrors?.description ? 'border-destructive' : ''}
              />
              {state.fieldErrors?.description && (
                <p className="text-sm text-destructive mt-1">{state.fieldErrors.description}</p>
              )}
            </div>

            <div>
              <Label>Category Image</Label>
              <CategoryImageUpload
                currentImage={null}
                onImageChange={setSelectedImage}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Category
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
