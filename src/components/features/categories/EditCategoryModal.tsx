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
import { startTransition } from 'react';

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  categoryDescription?: string | null;
  categoryImage?: string | null;
  onSuccess?: (updatedCategory: any) => void;
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
        
        toast.success('Catégorie mise à jour avec succès !', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        
        // Pass the updated category data to the success callback
        if (state.data) {
          onSuccess?.(state.data);
        } else {
          // If no data returned, create a temporary updated object
          const updatedCategory = {
            id: categoryId,
            name: state.values.name,
            description: state.values.description,
            image: selectedImage ? null : categoryImage, // Keep existing image if no new one selected
            createdAt: new Date(), // These will be updated when the page refreshes
            updatedAt: new Date(),
            deletedAt: null,
            isDeleted: false,
          };
          onSuccess?.(updatedCategory);
        }
        
        onClose();
        // Reset form
        setSelectedImage(null);
      } else if (state.error) {
        toast.error(state.error || 'Échec de la mise à jour de la catégorie', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, state.data, state.values, onSuccess, onClose, categoryId, selectedImage, categoryImage]);

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
    
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Modifier la Catégorie
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Mettre à jour les informations de la catégorie
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
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nom de la Catégorie *
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                required
                defaultValue={state.values?.name || categoryName}
                className={`transition-all duration-200 ${
                  state.fieldErrors?.name 
                    ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="ex: Lunettes de soleil, Montures, Lentilles de contact"
                disabled={isPending}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-destructive flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {state.fieldErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={state.values?.description || categoryDescription || ''}
                className={`transition-all duration-200 ${
                  state.fieldErrors?.description 
                    ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="Décrivez cette catégorie (optionnel)"
                disabled={isPending}
              />
              {state.fieldErrors?.description && (
                <p className="text-sm text-destructive flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {state.fieldErrors.description}
                </p>
              )}
            </div>
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

          <DialogFooter className="pt-4">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                variant="default"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 bg-background/50 backdrop-blur-sm border-border hover:bg-muted/50"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Mettre à Jour la Catégorie
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
